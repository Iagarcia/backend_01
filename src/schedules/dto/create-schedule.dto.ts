import {ApiProperty} from "@nestjs/swagger";

export class CreateScheduleDto {
    @ApiProperty({ example: 'SENT', description: 'The appointment state' })
    state: string;
    @ApiProperty({ example: '{"description": "My description"}', description: 'The schedule properties' })
    properties: string;
    @ApiProperty({ example: 1, description: 'The service ID' })
    serviceId: number;
    @ApiProperty({ example: 1, description: 'The contract ID' })
    contractId: number;
}