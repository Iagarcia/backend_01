import {ApiProperty} from "@nestjs/swagger";

export class UpdateSchedulePropertiesDto {
    @ApiProperty({ example: 1, description: 'The schedule Id' })
    id: number;
    @ApiProperty({ example: '{"description": "My description"}', description: 'The schedule properties' })
    properties: string;
}