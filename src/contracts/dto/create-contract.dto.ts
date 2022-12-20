import { ApiProperty } from "@nestjs/swagger";

export class CreateContractDto {
    @ApiProperty({ example: 'The Moon 1969', description: 'The appointment location' })
    place: string;
    @ApiProperty({ example: 'Brief description', description: 'The description' })
    description: string;
    @ApiProperty({ example: 'Cash', description: 'The payment method' })
    payment: string;
    @ApiProperty({ example: 150.3, description: 'The amount required' })
    amount: number;
}