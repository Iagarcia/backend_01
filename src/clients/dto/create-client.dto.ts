import {ApiProperty} from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateClientDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'Lef Traru', description: 'Full name', required: true })
    name: string;
    @IsNotEmpty()
    @ApiProperty({ example: '15341557', description: 'Taxpayer Identification Number', required: true})
    tin: string;
    @ApiProperty({ example: 'CHL', description: 'Country of nationality', required: false })
    nationality: string;
    @ApiProperty({ example: '1534/04/29', description: 'Anniversary of the birth', required: false  })
    birthday: string;
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
    @IsNotEmpty()
    @ApiProperty({ example: 'revolucion', description: 'Code used to confirm identity', required: true  })
    password: string;
}