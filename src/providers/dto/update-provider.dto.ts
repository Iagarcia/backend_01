import { ApiProperty } from '@nestjs/swagger';

export class UpdateProviderDto {
    @ApiProperty({ example: 'José Carrera', description: 'Full name', required: false })
    name: string;
    @ApiProperty({ example: '18211785', description: 'Taxpayer Identification Number', required: false})
    tin: string;
    @ApiProperty({ example: 'CL', description: 'Country of nationality', required: false })
    nationality: string;
    @ApiProperty({ example: '1785/10/15', description: 'Anniversary of the birth', required: false  })
    birthday: string;
    @ApiProperty({ example: 'jc@mail.cl', description: 'Electronic mail', required: false })
    email: string;
    @ApiProperty({ example: '88752111', description: 'Telephone number', required: false })
    phone: number;
    @ApiProperty({ example: 'Independencia 1810', description: 'Reachable location', required: false  })
    address: string;
    @ApiProperty({ example: 'libertad', description: 'Code used to confirm identity', required: false  })
    password: string;
    @ApiProperty({ example: '{"account": ["Bluecheese", "Crispy Bacon"]}', description: 'Account properties', required: false })
    properties: string;
    @ApiProperty({ example: false, description: 'User account state', required: false  })
    isActive: boolean;
}