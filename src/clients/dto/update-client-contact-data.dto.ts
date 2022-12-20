import { ApiProperty } from '@nestjs/swagger';

export class UpdateClientContactDataDto {
    @ApiProperty({ example: 'mc@libertador.cl', description: 'The email of the user' })
    email: string;
    @ApiProperty({ example: '987543265', description: 'The phone of the user' })
    phone: string;
    @ApiProperty({ example: 'Santiago 1785', description: 'The address of the user' })
    address: string;
}