import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateItemDto {
    @IsNotEmpty()
    @ApiProperty({ example: '1', description: 'Item identification', required: true })
    id: number;
    @ApiProperty({ example: 'McBacon V2', description: 'Item name', required: false })
    title: string;
    @ApiProperty({ example: 'Bacon Cheeseburger Version 2', description: 'General description', required: false })
    description: string;
    @ApiProperty({ example: 'USD', description: 'Money type', required: false })
    currency: string;
    @ApiProperty({ example: '3.45', description: 'Price by unit', required: false })
    unitCost: number;
    @ApiProperty({ example: '{"newingredients": ["Bluecheese", "Crispy Bacon"]}', description: 'Particular properties', required: false })
    properties: string;
}