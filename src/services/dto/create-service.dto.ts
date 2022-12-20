import { ApiProperty } from "@nestjs/swagger";

export class CreateServiceDto {
    @ApiProperty({ example: 'Main title', description: 'The title' })
    title: string;
    @ApiProperty({ example: 'Brief description', description: 'The description' })
    description: string;
    @ApiProperty({ example: 'USD', description: 'The coin code' })
    currency: string;
    @ApiProperty({ example: '1500', description: 'The service cost' })
    unitCost: number;
    @ApiProperty({ example: '{"specialty": "Kinesiología", "location": "Viña del Mar"    }', description: 'The service properties' })
    properties: string;

}
