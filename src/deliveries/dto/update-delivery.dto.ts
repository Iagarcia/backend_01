import {ApiProperty} from "@nestjs/swagger";
import { IsNotEmpty } from 'class-validator';

export class UpdateDeliveryDto {
    @IsNotEmpty()
    @ApiProperty({ example: '1', description: 'Delivery identification', required: true })
    id: number;
    @ApiProperty({ example: 'SENT', description: 'The delivery state', required: false })
    state: string;
    @ApiProperty({ example: '{"description": "My description"}', description: 'The delivery properties', required: false })
    properties: string;
}