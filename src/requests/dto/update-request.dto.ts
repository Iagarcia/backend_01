import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from 'class-validator';

export class UpdateRequestDto {
    @IsNotEmpty()
    @ApiProperty({ example: '1', description: 'Request identification', required: true })
    id: number;
    @ApiProperty({ example: 'The Sun 3521', description: 'The new appointment location', required: false })
    place: string;
    @ApiProperty({ example: '2023/03/14', description: 'The new request time', required: false })
    date: string;
    @ApiProperty({ example: 'Quota', description: 'The payment method (May be cash or quota)', required: false })
    paymentMethod: string;
    @ApiProperty({ example: 200.65, description: 'The amount required', required: false })
    amount: number;
    @ApiProperty({ example: '{"quotas": ["A", "B"]}', description: 'Particular properties', required: false  })
    properties: string;
}