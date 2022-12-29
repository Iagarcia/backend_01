import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsNumber } from 'class-validator';

export class UpdateClientContactDataDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: 'lt@mail.cl', description: 'Electronic mail', required: true })
    email: string;
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: '75554311', description: 'Telephone number', required: true })
    phone: number;
    @ApiProperty({ example: 'Tucapel 1553', description: 'Reachable location', required: false  })
    address: string;
}