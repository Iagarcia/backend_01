import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateProviderPersonalDataDto {
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
}