import { ApiProperty } from '@nestjs/swagger';

export class CreateProviderDto {
    @ApiProperty({ example: 'José Miguel Carrera Verdugo', description: 'Full name', required: true })
    name: string;
    @ApiProperty({ example: '17851821', description: 'Taxpayer Identification Number', required: true})
    tin: string;
    @ApiProperty({ example: 'CHL', description: 'Country of nationality', required: false })
    nationality: string;
    @ApiProperty({ example: '1785/10/15', description: 'Anniversary of the birth', required: false  })
    birthday: string;
    @ApiProperty({ example: 'jc@mail.cl', description: 'Electronic mail', required: true })
    email: string;
    @ApiProperty({ example: '88752111', description: 'Telephone number', required: true })
    phone: string;
    @ApiProperty({ example: 'Independencia 1810', description: 'Reachable location', required: false  })
    address: string;
    @ApiProperty({ example: 'libertad', description: 'Code used to confirm identity', required: true  })
    password: string;
}