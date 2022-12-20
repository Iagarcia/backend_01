import { ApiProperty } from '@nestjs/swagger';

export class ReauthenticateClientDto {
    @ApiProperty({ example: 'mc@libertador.cl', description: 'The email of the user' })
    email: string;
    @ApiProperty({ example: '$2b$10$EalUYougOBsgxWstu5IYFO2kcjbAKVL7oUS3DqVCaATJ8EJsM28QW', description: 'The encrypted password of the user' })
    password: string;
}