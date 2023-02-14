import { ApiProperty } from '@nestjs/swagger';

export class DeleteRequestDto {
    @ApiProperty({ example: 1, description: 'The request identification', required: true })
    id: number;
}