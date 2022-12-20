import { ApiProperty } from '@nestjs/swagger';

export class UpdateClientPropertiesDataDto {
    @ApiProperty({ example: '{"description": "My description"}', description: 'The properties of the user' })
    properties: string;
}