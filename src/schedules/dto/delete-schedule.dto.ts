import { ApiProperty } from "@nestjs/swagger";

export class DeleteScheduleDto {
    @ApiProperty({ example: 1, description: 'The schedule identification'})
    id: number;
}