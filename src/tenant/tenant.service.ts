import { BadRequestException, ConflictException, ForbiddenException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ChangePasswordDTO, CreateTenantDto, TenantDto, UpdateTenantDto } from './dto/tenant.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Tenant } from './schema/tenant.schema';
import { generateUniqueCode, generateUniqueKey, hashPassword, sendEmail, verifyPasswordHash } from 'src/utils/utils.function';
import { BaseResponseTypeDTO, UpdatePasswordDTO } from 'src/utils/utils.types';


@Injectable()
export class TenantService {

  constructor(@InjectModel(Tenant.name) private TenantModel: Model<Tenant>,) { }

  async create(CreateTenant: CreateTenantDto)
  // : Promise<Tenant> 
  {
    // checkForRequiredFields(['userId'], payload);
    const verificationCode = generateUniqueKey(4);

    let emailToUse = CreateTenant.email
    let recordExists = await this.TenantModel.findOne({ email: emailToUse }).exec()
    if (recordExists?.id) {
      let message = 'User with similar details already exists';
      if (recordExists.email === CreateTenant.email) {
        message = 'User with similar email already exists';
      }
      throw new ConflictException(message);
    }

    const partialTenant: Partial<TenantDto> = {
      ...CreateTenant,
      uniqueVerificationCode: verificationCode,
    };
    const createdEmployer = await new this.TenantModel(partialTenant);
    return await createdEmployer.save();
  }

  async findUserByEmailAndPassword(
    email: string,
    password: string,
  )
  // : Promise<UserResponseDTO> 
  {
    try {
      // let user = await this.TenantModel.findById(email);
      let user = await this.TenantModel.findOne({ email }).exec()
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

  async findTenantById(userId: string | mongoose.Types.ObjectId)
  // :  Promise<UserResponseDTO>
  {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new NotFoundException('User is not valid');
      }
      const data = await this.TenantModel.findOne({ _id: userId }).exec();
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
      const codeExists = await this.TenantModel.findOne({ uniqueVerificationCode: uniqueVerificationCode }).exec();

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
      const record = await this.TenantModel.findOne({ _id: userId }).exec();
      if (!record?.id) {
        throw new NotFoundException();
      }
      let token = record.uniqueVerificationCode;
      const tokenToUse = generateUniqueCode();
      // if (!token) {
      await this.TenantModel.updateOne(
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
      const userExists = await this.TenantModel.findOne({ email: email }).exec();
      if (userExists?.id) {
        const uniqueCode = generateUniqueCode();
        await this.TenantModel.updateOne(
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
      const userExists = await this.TenantModel.findOne({ uniqueVerificationCode: uniqueVerificationCode }).exec();
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
      const userExists = await this.TenantModel.findOne({ uniqueVerificationCode: uniqueVerificationCode }).exec();
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

        await this.TenantModel.updateOne(
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
      const userExists = await this.TenantModel.findOne({ _id: userid }).exec();
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

        await this.TenantModel.updateOne(
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



  async update(updateTenantDto: UpdateTenantDto): Promise<BaseResponseTypeDTO> {
    try {
      if (!updateTenantDto.tenantId) {
        throw new NotFoundException('Tenant ID is required for updating an Tenant');
      }

      let Tenant = await this.TenantModel.findOne({ _id: updateTenantDto.tenantId });
      if (!Tenant?.id) {
        throw new NotFoundException('Tenant with id not found');
      }

      // Check and update each Tenant field if provided in the DTO
      if (updateTenantDto.email && updateTenantDto.email !== Tenant.email) {
        Tenant.email = updateTenantDto.email;
      }

      // Check and update each Tenant field if provided in the DTO
      if (updateTenantDto.firstName && updateTenantDto.firstName !== Tenant.firstName) {
        Tenant.firstName = updateTenantDto.firstName;
      }


      const saveTenat = await Tenant.save();

      return {
        success: true,
        code: HttpStatus.OK,
        data: saveTenat,
        message: 'Tenant updated',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new Error(`Error updating Tenant: ${error.message}`);
      }
    }
  }






  ///////ALSO DELETE PROPERTY TENANT CONNECTION
  async deleteTenantById(id: string): Promise<Tenant | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Tenant ID is not valid');
    }
    // Find the employer to get associated data
    const Tenant = await this.TenantModel.findById(id);
    if (!Tenant) {
      throw new NotFoundException(`Tenant with ID not found.`);
    }
    // Delete related documents based on the Tenant's data
    // Assuming there's another model for the related documents, adjust accordingly

    // Now, delete the Tenant
    const deletedTenant = await this.TenantModel.findByIdAndDelete(id);
    if (!deletedTenant) {
      throw new NotFoundException(`Tenant with ID not found.`);
    }
    return deletedTenant;
  }
}
