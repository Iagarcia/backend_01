import { ApiProperty } from '@nestjs/swagger';

export class RetriveAccountDto {
    @ApiProperty({ example: 'jc@mail.cl', description: 'The user email' })
    email: string;
    @ApiProperty({ example: 'provider', description: 'The type account (provider/client)' })
    type: string;
}