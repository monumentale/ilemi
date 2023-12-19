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
import { CreateAgentDto, AgentDto } from './dto/agent.dto';
import { UpdatePasswordDTO } from 'src/utils/utils.types';


@Injectable()
export class AgentService {
  constructor(@InjectModel(Agent.name) private AgentModel: Model<Agent>) { }


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
        Jan:0,
        Feb:0,
        Mar:0,
        Apr:0,
        May:0,
        Jun:0,
        Jul:0,
        Aug:0,
        Sep:0,
        Oct:0,
        Nov:0,
        Dec:0,
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
      const data = await this.AgentModel.findOne({ _id: userId }).populate('reviews').exec();
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

}
