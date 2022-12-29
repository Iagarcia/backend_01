import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProviderDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'José Miguel Carrera Verdugo', description: 'Full name', required: true })
    name: string;
    @IsNotEmpty()
    @ApiProperty({ example: '17851821', description: 'Taxpayer Identification Number', required: true})
    tin: string;
    @ApiProperty({ example: 'CHL', description: 'Country of nationality', required: false })
    nationality: string;
    @ApiProperty({ example: '1785/10/15', description: 'Anniversary of the birth', required: false  })
    birthday: string;
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
    @IsNotEmpty()
    @ApiProperty({ example: 'libertad', description: 'Code used to confirm identity', required: true  })
    password: string;
}