import { ApiProperty } from '@nestjs/swagger';

export class AuthenticateProviderDto {
    @ApiProperty({ example: 'mc@libertador.cl', description: 'The email of the user' })
    email: string;
    @ApiProperty({ example: 'mys3cr3tp4ssw0rd', description: 'The password of the user' })
    password: string;
}