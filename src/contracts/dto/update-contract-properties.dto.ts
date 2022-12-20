import { ApiProperty } from '@nestjs/swagger';

export class UpdateContractPropertiesDto {
    @ApiProperty({ example: 1, description: 'The contract identification' })
    id: number;
    @ApiProperty({ example: '{"description": "My description"}', description: 'The contract properties' })
    properties: string;
}