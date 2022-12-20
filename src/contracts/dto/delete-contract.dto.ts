import { ApiProperty } from '@nestjs/swagger';

export class DeleteContractDto {
    @ApiProperty({ example: 1, description: 'The contract identification' })
    id: number;
}