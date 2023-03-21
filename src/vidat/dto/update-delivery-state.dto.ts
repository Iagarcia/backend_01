import {ApiProperty} from "@nestjs/swagger";

export class UpdateDeliveryStateDto {
    @ApiProperty({ example: 1, description: 'The delivery Id' })
    id: number;
    @ApiProperty({ example: 'SENT', description: 'The appointment state' })
    state: string;
}