import { ApiProperty } from '@nestjs/swagger';

export class UpdatePropertiesDataDto {
    @ApiProperty({ example: '{"description": "My description"}', description: 'User features', required: false   })
    properties: string;
}