import {ApiProperty} from "@nestjs/swagger";

export class CreateClientDto {
    @ApiProperty({ example: 'Miguel Carrera', description: 'The name of the user' })
    name: string;
    @ApiProperty({ example: '18654321-4', description: 'The rut of the user' })
    rut: string;
    @ApiProperty({ example: 'mc@libertador.cl', description: 'The email of the user' })
    email: string;
    @ApiProperty({ example: '987543265', description: 'The phone of the user' })
    phone: string;
    @ApiProperty({ example: 'CL', description: 'The nation code of the user' })
    nationality: string;
    @ApiProperty({ example: 'Santiago 1785', description: 'The address of the user' })
    address: string;
    @ApiProperty({ example: '1785/09/15', description: 'The birthday of the user' })
    birthday: string;
    @ApiProperty({ example: 'mys3cr3tp4ssw0rd', description: 'The password of the user' })
    password: string;
}