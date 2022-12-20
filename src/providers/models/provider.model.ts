import { Column, Model, Table, HasMany, Unique, AllowNull } from 'sequelize-typescript';
import { Service } from '../../services/models/service.model';

@Table
export class Provider extends Model {
    //PERSONAL DATA
    @AllowNull(false)
    @Column
    name: string;

    @AllowNull(false)
    @Unique
    @Column
    rut: string;

    @Column
    nationality: string;

    @Column
    birthday: Date;

    //CONTACT DATA
    @AllowNull(false)
    @Unique
    @Column
    email: string;

    @AllowNull(false)
    @Unique
    @Column
    phone: string;

    @Column
    address: string;

    @AllowNull(false)
    @Column
    password: string;

    //EXTRA DATA
    @Column({type: 'jsonb'})
    properties: string;

    @Column({ defaultValue: true })
    isActive: boolean;

    @HasMany(() => Service)
    services: Service[];
}