import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from 'class-validator';

export class CreateRequestDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'The Moon 1969', description: 'The appointment location', required: true })
    place: string;
    @IsNotEmpty()
    @ApiProperty({ example: '2023/02/14', description: 'The request time', required: true })
    date: string;
    @IsNotEmpty()
    @ApiProperty({ example: 'Cash', description: 'The payment method (May be cash or quota)', required: true })
    paymentMethod: string;
    @IsNotEmpty()
    @ApiProperty({ example: 150.3, description: 'The amount required', required: true })
    amount: number;
    @ApiProperty({ example: '{"ingredients": ["Cheese", "Bacon"]}', description: 'Particular properties', required: false  })
    properties: string;
}