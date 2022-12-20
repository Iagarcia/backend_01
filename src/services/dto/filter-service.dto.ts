import { ApiProperty } from '@nestjs/swagger';

export class FilterServiceDto {
    @ApiProperty({ example: "Kinesiología", description: 'Medical attention specialty' })
    specialty: string;
    @ApiProperty({ example: "Viña del Mar", description: 'Service city' })
    location: string;
}