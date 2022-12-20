import { ApiProperty } from '@nestjs/swagger';

export class UpdateContractGeneralDataDto {
    @ApiProperty({ example: 1, description: 'The contract identification' })
    id: number;
    @ApiProperty({ example: 'The Moon 1969', description: 'The appointment location' })
    place: string;
    @ApiProperty({ example: 'Brief description', description: 'The description' })
    description: string;
}