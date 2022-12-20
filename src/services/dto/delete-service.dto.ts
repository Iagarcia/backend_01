import { ApiProperty } from '@nestjs/swagger';

export class DeleteServiceDto {
    @ApiProperty({ example: 1, description: 'The service identification' })
    id: number;
}