import {
  Injectable,
  HttpStatus,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { checkForRequiredFields, validateEmailField, encryptData, hashPassword, generateUniqueKey, sendEmail } from '../utils/utils.function';
import { LoginUserDTO, SignUpDTO, } from './dto/auth.dto';
import { sign } from 'jsonwebtoken';
import { AgentService } from 'src/agent/agent.service';
import { TenantService } from 'src/tenant/tenant.service';


@Injectable()
export class AuthService {
  constructor(private readonly AgentSrv: AgentService,private readonly TenantSrv: TenantService,) { }

  private signPayload<T extends string | object | Buffer>(payload: T): string {
    return sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
  }

  // async ThirdPartysignUpOrLogin(
  //   payload: ThirdPartyLoginDTO,
  // ): Promise<ThirdPartyAuthResponseDTO> {
  //   try {
  //     checkForRequiredFields(['provider', 'thirdPartyUserId'], payload);
  //     compareEnumValueFields(
  //       payload.provider,
  //       Object.values(AuthProvider),
  //       'provider',
  //     );
  //     let isNewUser = false;
  //     const relations = [
  //       'userProfiles',
  //       'userProfiles.department',
  //       'userProfiles.institution',
  //     ];
  //     const findOptions: FindOneOptions<User> = {
  //       where: { externalUserId: payload.thirdPartyUserId },
  //       relations,
  //     };
  //     // if (payload.email && !payload.thirdPartyUserId) {
  //     if (payload.email) {
  //       const emailToLowercase = payload.email.toLowerCase();
  //       findOptions.where = { email: emailToLowercase };
  //     }
  //     let record = await this.userSrv.getRepo().findOne(findOptions);
  //     if (!record?.id) {
  //       isNewUser = true;
  //       const createdRecord = await this.userSrv.create<Partial<User>>({
  //         ...payload,
  //         externalUserId: payload.thirdPartyUserId,
  //         status: true,
  //       });
  //       if (createdRecord?.id) {
  //         // Create record of settings for this user
  //         await this.userSettingSrv.setUserSetting(
  //           { canReceiveEmailUpdates: true, canReceiveNotifications: true },
  //           createdRecord.id,
  //         );
  //         record = await this.userSrv.getRepo().findOne({
  //           where: { id: createdRecord.id },
  //           relations,
  //         });
  //       }
  //     }
  //     const { dateCreated, email, role, id } = record;
  //     const token = this.signForAuthToken(dateCreated, email, role, id, record);
  //     const decodedToken: any = decode(token);
  //     const { exp, iat } = decodedToken;
  //     return {
  //       success: true,
  //       message: 'Login successful',
  //       code: HttpStatus.OK,
  //       data: {
  //         userId: id,
  //         isNewUser,
  //         isProfileDataSet: record.userProfiles?.length > 0 ? true : false,
  //         role,
  //         email,
  //         dateCreated,
  //         token,
  //         tokenInitializationDate: iat,
  //         tokenExpiryDate: exp,
  //         user: record,
  //       },
  //     };
  //   } catch (ex) {
  //     this.logger.error(ex);
  //     throw ex;
  //   }
  // } 


  async AgentsignUp(payload: SignUpDTO)
  // : Promise<AuthResponseDTO> 
  {
    try {
      // checkForRequiredFields(['provider', 'thirdPartyUserId'], payload);
      if (payload.email) {
        validateEmailField(payload.email);
      }

      let password = await hashPassword(payload.password ?? '12345');
      let record = await this.AgentSrv.create({ email: payload.email, password: password, firstName: payload.firstName, lastName: payload.lastName });

      const { email, uniqueVerificationCode, role } = record;
      const payloadToSign = encryptData(
        JSON.stringify({
          user: record,
          email,
          role
        }),
        process.env.ENCRYPTION_KEY,
      );
      const token = this.signPayload({ data: payloadToSign });
      const htmlEmailTemplate = `
      <h2>Please copy the code below to verify your account</h2>
      <h3>${uniqueVerificationCode}</h3>
    `;

      await sendEmail(htmlEmailTemplate, 'Verify Account', [email]);

      return {
        success: true,
        code: HttpStatus.OK,
        message: 'User Logged in',
        data: {
          user: record,
          token,
        },
      };
    } catch (ex) {
      throw ex;
    }
  }



  async Agentlogin(payload: LoginUserDTO)
  // : Promise<AuthResponseDTO> 
  {
    try {
      checkForRequiredFields(['email', 'password'], payload);
      validateEmailField(payload.email);
      const user = await this.AgentSrv.findUserByEmailAndPassword(
        payload.email,
        payload.password,
      );
      if (user?.data.id) {
        const {
          data: {
            // dateCreated, 
            email,
            role,
            id },
        } = user;
        const payloadToSign = encryptData(
          JSON.stringify({
            user: user.data,
            // dateCreated,
            email,
            role,
            // role,
            id,
          }),
          process.env.ENCRYPTION_KEY,
        );
        const token = this.signPayload({ data: payloadToSign });
        const htmlEmailTemplate = `
        <h2>Please copy the code below to login</h2>
        <h3>${user.data.uniqueVerificationCode}</h3>
      `;
  
        await sendEmail(htmlEmailTemplate, 'Verify Account', [email]);

        return {
          success: true,
          code: HttpStatus.OK,
          message: 'Logged in',
          data: {
            userId: id,
            // role,
            user: user.data,
            token,
          },
        };
      }
      throw new NotFoundException('Invalid credentials');
    } catch (ex) {
      // this.logger.log(ex);
      throw ex;
    }
  }



////////////////////////////////////////////////////////Tenat///////////////////////////////////////



async TenantsignUp(payload: SignUpDTO)
// : Promise<AuthResponseDTO> 
{
  try {
    // checkForRequiredFields(['provider', 'thirdPartyUserId'], payload);
    if (payload.email) {
      validateEmailField(payload.email);
    }

    let password = await hashPassword(payload.password ?? '12345');
    let record = await this.TenantSrv.create({ email: payload.email, password: password, firstName: payload.firstName, lastName: payload.lastName });

    const { email, uniqueVerificationCode, role } = record;
    const payloadToSign = encryptData(
      JSON.stringify({
        user: record,
        email,
        role
      }),
      process.env.ENCRYPTION_KEY,
    );
    const token = this.signPayload({ data: payloadToSign });
    const htmlEmailTemplate = `
    <h2>Please copy the code below to verify your account</h2>
    <h3>${uniqueVerificationCode}</h3>
  `;

    await sendEmail(htmlEmailTemplate, 'Verify Account', [email]);

    return {
      success: true,
      code: HttpStatus.OK,
      message: 'User Logged in',
      data: {
        user: record,
        token,
      },
    };
  } catch (ex) {
    throw ex;
  }
}



async Tenantlogin(payload: LoginUserDTO)
// : Promise<AuthResponseDTO> 
{
  try {
    checkForRequiredFields(['email', 'password'], payload);
    validateEmailField(payload.email);
    const user = await this.TenantSrv.findUserByEmailAndPassword(
      payload.email,
      payload.password,
    );
    if (user?.data.id) {
      const {
        data: {
          // dateCreated, 
          email,
          role,
          id },
      } = user;
      const payloadToSign = encryptData(
        JSON.stringify({
          user: user.data,
          // dateCreated,
          email,
          role,
          // role,
          id,
        }),
        process.env.ENCRYPTION_KEY,
      );
      const token = this.signPayload({ data: payloadToSign });
      const htmlEmailTemplate = `
      <h2>Please copy the code below to login</h2>
      <h3>${user.data.uniqueVerificationCode}</h3>
    `;

      await sendEmail(htmlEmailTemplate, 'Verify Account', [email]);

      return {
        success: true,
        code: HttpStatus.OK,
        message: 'Logged in',
        data: {
          userId: id,
          // role,
          user: user.data,
          token,
        },
      };
    }
    throw new NotFoundException('Invalid credentials');
  } catch (ex) {
    // this.logger.log(ex);
    throw ex;
  }
}
}
