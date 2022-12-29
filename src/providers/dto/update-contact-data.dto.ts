import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsNumber } from 'class-validator';

export class UpdateProviderContactDataDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: 'jc@mail.cl', description: 'Electronic mail', required: true })
    email: string;
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: '88752111', description: 'Telephone number', required: true })
    phone: number;
    @ApiProperty({ example: 'Independencia 1810', description: 'Reachable location', required: false  })
    address: string;
}