import { ApiProperty } from '@nestjs/swagger';

export class UpdateClientDto {
    @ApiProperty({ example: 'Lautaro', description: 'Full name', required: false })
    name: string;
    @ApiProperty({ example: '15571534', description: 'Taxpayer Identification Number', required: false})
    tin: string;
    @ApiProperty({ example: 'WMP', description: 'Country of nationality', required: false })
    nationality: string;
    @ApiProperty({ example: '1557/04/29', description: 'Anniversary of the birth', required: false  })
    birthday: string;
    @ApiProperty({ example: 'lt@mail.cl', description: 'Electronic mail', required: false })
    email: string;
    @ApiProperty({ example: '75554311', description: 'Telephone number', required: false })
    phone: number;
    @ApiProperty({ example: 'Tucapel 1553', description: 'Reachable location', required: false  })
    address: string;
    @ApiProperty({ example: 'revolucion', description: 'Code used to confirm identity', required: false  })
    password: string;
    @ApiProperty({ example: '{"account": ["Bluecheese", "Crispy Bacon"]}', description: 'Account properties', required: false })
    properties: string;
    @ApiProperty({ example: false, description: 'User account state', required: false  })
    isActive: boolean;
}