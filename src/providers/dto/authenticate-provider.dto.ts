import { ApiProperty } from '@nestjs/swagger';

export class AuthenticateProviderDto {
    @ApiProperty({ example: 'jc@mail.cl', description: 'Electronic mail', required: true })
    email: string;
    @ApiProperty({ example: 'libertad', description: 'Code used to confirm identity', required: true  })
    password: string;
}