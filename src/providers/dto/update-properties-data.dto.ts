import { ApiProperty } from '@nestjs/swagger';

export class UpdatePropertiesDataDto {
    @ApiProperty({ example: '{"description": "My description"}', description: 'The email of the user' })
    properties: string;
}