import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RecoverProviderDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: 'jc@mail.cl', description: 'Electronic mail', required: true })
    email: string;
    @IsNotEmpty()
    @ApiProperty({ example: 'libertad', description: 'Code used to confirm identity', required: true  })
    password: string;
}