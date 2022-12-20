import { ApiProperty } from '@nestjs/swagger';

export class UpdateServicePhotosDto {
    @ApiProperty({ example: 1, description: 'The service identification' })
    id: number;

    @ApiProperty({
        description: 'Attachments',
        type: 'array',
        items: {
            type: 'file',
            items: {
                type: 'string',
                format: 'binary',
            },
        },
    })
    files: any[];
}