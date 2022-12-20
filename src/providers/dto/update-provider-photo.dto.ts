import { ApiProperty } from '@nestjs/swagger';

export class UpdateProviderPhotoDto {
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
    file: any;
}