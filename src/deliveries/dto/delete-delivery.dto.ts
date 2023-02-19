import {ApiProperty} from "@nestjs/swagger";
import { IsNotEmpty } from 'class-validator';

export class DeleteDeliveryDto {
    @IsNotEmpty()
    @ApiProperty({ example: '1', description: 'Delivery identification', required: true })
    id: number;
}