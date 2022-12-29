import { Column, Model, Table, HasMany, Unique, AllowNull } from 'sequelize-typescript';
import { Contract } from '../../contracts/models/contract.model';

@Table
export class Client extends Model {
    //PERSONAL DATA
    @AllowNull(false)
    @Column
    name: string;

    @AllowNull(false)
    @Unique
    @Column
    tin: string;

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
    phone: number;

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

    @HasMany(() => Contract)
    contracts: Contract[]
}