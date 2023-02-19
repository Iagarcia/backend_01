import {ApiProperty} from "@nestjs/swagger";

export class CreateDeliveryDto {
    @ApiProperty({ example: 'SENT', description: 'The delivery state', required: true })
    state: string;
    @ApiProperty({ example: '{"description": "My description"}', description: 'The delivery properties', required: true })
    properties: string;
    @ApiProperty({ example: 1, description: 'The item ID', required: true })
    itemId: number;
    @ApiProperty({ example: 1, description: 'The request ID', required: true })
    requestId: number;
}