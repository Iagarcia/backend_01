import { ApiProperty } from '@nestjs/swagger';

export class ReauthenticateProviderDto {
    @ApiProperty({ example: 'mc@libertador.cl', description: 'The email of the user' })
    email: string;
    @ApiProperty({ example: '$2b$10$fztlg6WI9b/O3/UqLScwGOulGuD/bu8xIrEIh99JvP6a9STR3OFv.', description: 'The encrypted password of the user' })
    password: string;
}