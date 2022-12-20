import { ApiProperty } from '@nestjs/swagger';

export class UpdateServicePropertiesDto {
    @ApiProperty({ example: 1, description: 'The service identification' })
    id: number;
    @ApiProperty({ example: '{"LU": [{"init": "0900", "end":"1300"}, {"init": "1400", "end":"1700"}]}', description: 'The service properties' })
    properties: string;
}