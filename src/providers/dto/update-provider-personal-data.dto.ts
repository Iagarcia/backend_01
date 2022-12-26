import { ApiProperty } from '@nestjs/swagger';

export class UpdateProviderPersonalDataDto {
    @ApiProperty({ example: 'José Miguel Carrera Verdugo', description: 'Full name', required: false })
    name: string;
    @ApiProperty({ example: '17851821', description: 'Taxpayer Identification Number', required: false})
    tin: string;
    @ApiProperty({ example: 'CHL', description: 'Country of nationality', required: false })
    nationality: string;
    @ApiProperty({ example: '1785/10/15', description: 'Anniversary of the birth', required: false  })
    birthday: string;
}