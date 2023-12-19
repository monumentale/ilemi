export class CreateAuthDto {}
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseTypeDTO } from '../../utils/utils.types';
import { AppRole, AuthProvider } from '../../utils/utils.constant';
// import { User } from '@entities/index';

export class AuthResponse {
    @ApiProperty()
    userId: string;

    @ApiProperty({
        enum: AppRole,
    })
    role: AppRole;

    @ApiProperty()
    token: string;

    //   @ApiProperty({ type: User })
    //   user: User;
}

export class SignUpDTO {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;
}

export class LoginUserDTO {
    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;
}

export class LoginPhoneUserDTO {
    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    password: string;
}

export class OTPUserDTO {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    uniqueVerificationCode: string;
}

export class ThirdPartyLoginDTO {
    @ApiProperty({
        description:
            'UserId or any other unique identifier assigned by google or facebook',
    })
    thirdPartyUserId: string;

    @ApiProperty({ enum: AuthProvider })
    provider: AuthProvider;

    @ApiProperty({ nullable: true, description: 'Nullable' })
    profileImageUrl: string;

    @ApiProperty({ nullable: true, description: 'Nullable' })
    email: string;

    @ApiProperty({ nullable: true, description: 'Nullable' })
    phoneNumber: string;
}

export class AuthResponseDTO extends BaseResponseTypeDTO {
    @ApiProperty()
    data: AuthResponse;
}
