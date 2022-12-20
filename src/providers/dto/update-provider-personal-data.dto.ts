import { ApiProperty } from '@nestjs/swagger';

export class UpdateProviderPersonalDataDto {
    @ApiProperty({ example: 'Bernardo Higgins', description: 'The name of the user' })
    name: string;
    @ApiProperty({ example: '18654321-4', description: 'The rut of the user' })
    rut: string;
    @ApiProperty({ example: 'CL', description: 'The nation code of the user' })
    nationality: string;
    @ApiProperty({ example: '1785/09/15', description: 'The birthday of the user' })
    birthday: string;
}