import { Model } from 'mongoose';
import {
  Injectable,
  HttpStatus,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { verifyPasswordHash, generateUniqueKey, generateUniqueCode, sendEmail, hashPassword } from '../utils/utils.function';
import mongoose from "mongoose";
import { Query } from 'express-serve-static-core';
import { Agent } from './schema/agent.schema';
import { CreateAgentDto, AgentDto, ChangePasswordDTO, UpdateAgentDto } from './dto/agent.dto';
import { BaseResponseTypeDTO, UpdatePasswordDTO } from 'src/utils/utils.types';
import { Property } from 'src/property/schema/property.schema';


@Injectable()
export class AgentService {
  constructor(@InjectModel(Agent.name) private AgentModel: Model<Agent>, @InjectModel(Property.name) private PropertyModel: Model<Property>) { }


  async create(CreateAgent: CreateAgentDto)
  // : Promise<Agent> 
  {
    // checkForRequiredFields(['userId'], payload);
    const verificationCode = generateUniqueKey(4);

    let emailToUse = CreateAgent.email
    let recordExists = await this.AgentModel.findOne({ email: emailToUse }).exec()
    if (recordExists?.id) {
      let message = 'User with similar details already exists';
      if (recordExists.email === CreateAgent.email) {
        message = 'User with similar email already exists';
      }
      throw new ConflictException(message);
    }

    const partialAgent: Partial<AgentDto> = {
      ...CreateAgent,
      uniqueVerificationCode: verificationCode,
      PropertyDataCount: {
        Jan: 0,
        Feb: 0,
        Mar: 0,
        Apr: 0,
        May: 0,
        Jun: 0,
        Jul: 0,
        Aug: 0,
        Sep: 0,
        Oct: 0,
        Nov: 0,
        Dec: 0,
      }

    };
    const createdEmployer = await new this.AgentModel(partialAgent);
    return await createdEmployer.save();
  }

  async findUserByEmailAndPassword(
    email: string,
    password: string,
  )
  // : Promise<UserResponseDTO> 
  {
    try {
      // let user = await this.AgentModel.findById(email);
      let user = await this.AgentModel.findOne({ email }).exec()
      console.log(user)
      if (user?.id
        //work on signup to hash password and save to database 
        && (await verifyPasswordHash(password, user.password))
      ) {
        return {
          success: true,
          code: HttpStatus.OK,
          data: user,
          message: 'User found',
        };
      }
      throw new NotFoundException('Invalid credentials');
    } catch (ex) {
      // this.logger.error(ex);
      throw ex;
    }
  }

  async findAgentById(userId: string | mongoose.Types.ObjectId)
  // :  Promise<UserResponseDTO>
  {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new NotFoundException('User is not valid');
      }
      const data = await this.AgentModel.findOne({ _id: userId }).exec();
      if (data?.id) {
        return {
          success: true,
          code: HttpStatus.OK,
          data,
          message: 'User found',
        };
      }
      throw new NotFoundException('User not found');
    } catch (ex) {
      throw ex;
    }
  }

  async verifyCodeAfterSignuporLogin(
    uniqueVerificationCode: string,
    userId: string,
  )
  // : Promise<BaseResponseTypeDTO> 
  {
    try {
      const codeExists = await this.AgentModel.findOne({ uniqueVerificationCode: uniqueVerificationCode }).exec();

      if (codeExists?.id) {
        console.log(codeExists)
        if (codeExists.id !== userId) {
          throw new ForbiddenException('This code does not belong to you');
        }
        // Activate the user account
        codeExists.status = true
        await codeExists.save();
        return {
          success: true,
          code: HttpStatus.OK,
          message: 'Code verified',
        };
      }
      throw new NotFoundException('Code was not found');
    } catch (ex) {
      throw ex;
    }
  }

  async resendOTPAfterLogin(userId: string)
  // : Promise<BaseResponseTypeDTO>
  {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new NotFoundException('User is not valid');
      }
      if (!userId) {
        throw new BadRequestException('Field userId is required');
      }
      const record = await this.AgentModel.findOne({ _id: userId }).exec();
      if (!record?.id) {
        throw new NotFoundException();
      }
      let token = record.uniqueVerificationCode;
      const tokenToUse = generateUniqueCode();
      // if (!token) {
      await this.AgentModel.updateOne(
        { _id: userId },
        { $set: { uniqueVerificationCode: tokenToUse } }
      );

      // }
      const htmlEmailTemplate = `
          <h2>Please copy the code below to verify your account</h2>
          <h3>${tokenToUse}</h3>
        `;
      await sendEmail(htmlEmailTemplate, 'Verify Account', [record.email]);
      return {
        success: true,
        code: HttpStatus.OK,
        message: 'Token has been resent',
      };
    } catch (ex) {
      throw ex;
    }
  }

  async initiateForgotPasswordFlow(
    email: string,
  ) {
    try {
      const userExists = await this.AgentModel.findOne({ email: email }).exec();
      if (userExists?.id) {
        const uniqueCode = generateUniqueCode();
        await this.AgentModel.updateOne(
          { _id: userExists.id },
          { $set: { uniqueVerificationCode: uniqueCode } }
        );
        const htmlEmailTemplate = `
            <h2>Please copy the code below to verify your account ownership</h2>
            <h3>${uniqueCode}</h3>
          `;
        const emailResponse = await sendEmail(
          htmlEmailTemplate,
          'Verify Account Ownership',
          [email],
        );
        if (emailResponse.success) {
          return {
            ...emailResponse,
            message: 'Confirmation email sent',
          };
        }
        throw new InternalServerErrorException('Email was not sent');
      }
      throw new NotFoundException('User was not found');
    } catch (ex) {
      throw ex;
    }
  }

  async finalizeForgotPasswordFlow(
    uniqueVerificationCode: string,
  ) {
    try {
      const userExists = await this.AgentModel.findOne({ uniqueVerificationCode: uniqueVerificationCode }).exec();
      if (userExists?.id) {
        return {
          success: true,
          code: HttpStatus.OK,
          message: 'Unique token is valid',
        };
      }
      throw new NotFoundException('Invalid verification code');
    } catch (ex) {
      throw ex;
    }
  }

  async changePassword({
    uniqueVerificationCode,
    newPassword,
  }: UpdatePasswordDTO) {
    try {
      const userExists = await this.AgentModel.findOne({ uniqueVerificationCode: uniqueVerificationCode }).exec();
      if (userExists?.id) {
        const doesOldAndNewPasswordMatch = await verifyPasswordHash(
          newPassword,
          userExists.password,
        );
        if (doesOldAndNewPasswordMatch) {
          const message = 'Both old and new password match';
          throw new ConflictException(message);
        }
        const hashedPassword = await hashPassword(newPassword);

        await this.AgentModel.updateOne(
          { _id: userExists.id },
          { $set: { password: hashedPassword } }
        );

        return {
          success: true,
          code: HttpStatus.OK,
          message: 'Password changed successfully',
        };
      }
      throw new NotFoundException('Invalid verification code');
    } catch (ex) {
      throw ex;
    }
  }

  async changePasswordAcc({
    userid,
    OldPassword,
    newPassword,
  }: ChangePasswordDTO) {
    try {
      const userExists = await this.AgentModel.findOne({ _id: userid }).exec();
      if (userExists?.id) {
        const doesOldPasswordAlignWithNewpassord = await verifyPasswordHash(
          OldPassword,
          userExists.password,
        );

        if (!doesOldPasswordAlignWithNewpassord) {
          const message = 'The Old Password Does Not Belong To This Account';
          throw new ConflictException(message);
        }

        const doesOldAndNewPasswordMatch = await verifyPasswordHash(
          newPassword,
          userExists.password,
        );


        if (doesOldAndNewPasswordMatch) {
          const message = 'Both old and new password match';
          throw new ConflictException(message);
        }


        const hashedPassword = await hashPassword(newPassword);

        await this.AgentModel.updateOne(
          { _id: userExists.id },
          { $set: { password: hashedPassword } }
        );

        return {
          success: true,
          code: HttpStatus.OK,
          message: 'Password changed successfully',
        };
      }
      throw new NotFoundException('Invalid verification code');
    } catch (ex) {
      throw ex;
    }
  }

  async updatePropertyDataCount(agentId: string): Promise<Agent> {
    const currentMonth = new Date().toLocaleString('en-US', { month: 'short' });
    console.log(currentMonth)
    try {
      const agent = await this.AgentModel.findById(agentId);

      if (!agent) {
        throw new NotFoundException('Agent not found');
      }
      // Increment the count for the current month
      agent.PropertyDataCount[currentMonth]++;

      // Save the updated agent document
      return await agent.save();
    } catch (error) {
      throw new NotFoundException(`Failed to update PropertyDataCount: ${error.message}`);
    }
  }


  async update(updateAgentDto: UpdateAgentDto): Promise<BaseResponseTypeDTO> {
    try {
      if (!updateAgentDto.agentId) {
        throw new NotFoundException('Agent ID is required for updating an agent');
      }

      let agent = await this.AgentModel.findOne({  _id: updateAgentDto.agentId });
      if (!agent?.id) {
        throw new NotFoundException('Agent with id not found');
      }

      // Check and update each agent field if provided in the DTO
      if (updateAgentDto.email && updateAgentDto.email !== agent.email) {
        agent.email = updateAgentDto.email;
      }

      // Check and update each agent field if provided in the DTO
      if (updateAgentDto.firstName && updateAgentDto.firstName !== agent.firstName) {
        agent.firstName = updateAgentDto.firstName;
      }

      if (updateAgentDto.HouseAddress && updateAgentDto.HouseAddress !== agent.HouseAddress) {
        agent.HouseAddress = updateAgentDto.HouseAddress;
      }

      if (updateAgentDto.State && updateAgentDto.State !== agent.State) {
        agent.State = updateAgentDto.State;
      }

      if (updateAgentDto.City && updateAgentDto.City !== agent.City) {
        agent.City = updateAgentDto.City;
      }

      if (updateAgentDto.NINNumber && updateAgentDto.NINNumber !== agent.NINNumber) {
        agent.NINNumber = updateAgentDto.NINNumber;
      }

      if (updateAgentDto.CompanyName && updateAgentDto.CompanyName !== agent.CompanyName) {
        agent.CompanyName = updateAgentDto.CompanyName;
      }

      if (updateAgentDto.WhatsappNumber && updateAgentDto.WhatsappNumber !== agent.WhatsappNumber) {
        agent.WhatsappNumber = updateAgentDto.WhatsappNumber;
      }


      if (updateAgentDto.NINback && updateAgentDto.NINback !== agent.NINback) {
        agent.NINback = updateAgentDto.NINback;
      }


      if (updateAgentDto.NINfront && updateAgentDto.NINfront !== agent.NINfront) {
        agent.NINfront = updateAgentDto.NINfront;
      }

      if (updateAgentDto.lastName && updateAgentDto.lastName !== agent.lastName) {
        agent.lastName = updateAgentDto.lastName;
      }

      if (updateAgentDto.phoneNumber && updateAgentDto.phoneNumber !== agent.phoneNumber) {
        agent.phoneNumber = updateAgentDto.phoneNumber;
      }

      // if (updateAgentDto.role && updateAgentDto.role !== agent.role) {
      //   agent.role = updateAgentDto.role;
      // }

      if (updateAgentDto.profilePic && updateAgentDto.profilePic !== agent.profilePic) {
        agent.profilePic = updateAgentDto.profilePic;
      }

      if (updateAgentDto.status !== undefined && updateAgentDto.status !== agent.status) {
        agent.status = updateAgentDto.status;
      }

      if (updateAgentDto.AdmimVerificationStatus !== undefined && updateAgentDto.AdmimVerificationStatus !== agent.AdmimVerificationStatus) {
        agent.AdmimVerificationStatus = updateAgentDto.AdmimVerificationStatus;
      }

      if (updateAgentDto.PropertyDataCount !== undefined && updateAgentDto.PropertyDataCount !== agent.PropertyDataCount) {
        agent.PropertyDataCount = updateAgentDto.PropertyDataCount;
      }

      const savedAgent = await agent.save();

      return {
        success: true,
        code: HttpStatus.OK,
        data: savedAgent,
        message: 'Agent updated',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new Error(`Error updating agent: ${error.message}`);
      }
    }
  }


  async getAndUpdateSubscriptionInfo(agentId: string, isSubscribed: boolean, currentPlanName: string, currentSubscriptionId: string): Promise<any> {
    const agent = await this.AgentModel.findById(agentId).exec();

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    agent.isSubscribed = isSubscribed;
    agent.CurrentPlanName = currentPlanName;
    agent.CurrentSubscriptionid = currentSubscriptionId;

    return await agent.save();
  }




  ///////ALSO DELETE PROPERTY TENANT CONNECTION
  async deleteAgentById(id: string): Promise<Agent | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Agent ID is not valid');
    }
    // Find the employer to get associated data
    const agent = await this.AgentModel.findById(id);
    if (!agent) {
      throw new NotFoundException(`Agent with ID not found.`);
    }
    // Delete related documents based on the agent's data
    // Assuming there's another model for the related documents, adjust accordingly
    const deletedJobs = await this.PropertyModel.deleteMany({ AgentId: agent.id });


    //  const deletedCandidates= await this.JobConnectionModel.deleteMany({ agent: agent.id });
    //  console.log(deletedCandidates)
    console.log(deletedJobs)
    // Now, delete the agent
    const deletedagent = await this.AgentModel.findByIdAndDelete(id);
    if (!deletedagent) {
      throw new NotFoundException(`Agent with ID not found.`);
    }
    return deletedagent;
  }

}
