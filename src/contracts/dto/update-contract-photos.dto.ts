import { ApiProperty } from '@nestjs/swagger';

export class UpdateContractPhotosDto {
    @ApiProperty({ example: 1, description: 'The contract identification' })
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