import { ApiProperty } from '@nestjs/swagger';

export class UpdateProviderPropertiesDto {
    @ApiProperty({ example: '{"description": "My description"}', description: 'User features', required: false   })
    properties: string;
}