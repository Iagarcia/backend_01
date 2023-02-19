import { ApiProperty } from '@nestjs/swagger';

export class DeleteItemDto {
    @ApiProperty({ example: 1, description: 'The item identification', required: true })
    id: number;
}