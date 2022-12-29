import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthenticateClientDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: 'lt@mail.cl', description: 'Electronic mail', required: true })
    email: string;
    @IsNotEmpty()
    @ApiProperty({ example: 'revolucion', description: 'Code used to confirm identity', required: true  })
    password: string;
}