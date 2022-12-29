import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateClientPersonalDataDto {
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
}