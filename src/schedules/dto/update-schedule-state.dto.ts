import {ApiProperty} from "@nestjs/swagger";

export class UpdateScheduleStateDto {
    @ApiProperty({ example: 1, description: 'The schedule Id' })
    id: number;
    @ApiProperty({ example: 'SENT', description: 'The appointment state' })
    state: string;
}