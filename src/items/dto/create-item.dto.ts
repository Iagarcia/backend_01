import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateItemDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'McBacon', description: 'Item name', required: true })
    title: string;
    @IsNotEmpty()
    @ApiProperty({ example: 'Bacon Cheeseburger', description: 'General description', required: true })
    description: string;
    @IsNotEmpty()
    @ApiProperty({ example: 'USD', description: 'Money type', required: true })
    currency: string;
    @IsNotEmpty()
    @ApiProperty({ example: '2.45', description: 'Price by unit', required: true })
    unitCost: number;
    @ApiProperty({ example: '{"ingredients": ["Cheese", "Bacon"]}', description: 'Particular properties', required: false  })
    properties: string;
}