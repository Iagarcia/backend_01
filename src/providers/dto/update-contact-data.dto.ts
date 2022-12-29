import { ApiProperty } from '@nestjs/swagger';

export class UpdateProviderContactDataDto {
    @ApiProperty({ example: 'jc@mail.cl', description: 'Electronic mail', required: true })
    email: string;
    @ApiProperty({ example: '88752111', description: 'Telephone number', required: true })
    phone: string;
    @ApiProperty({ example: 'Independencia 1810', description: 'Reachable location', required: false  })
    address: string;
}