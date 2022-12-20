import { Column, Model, Table, AllowNull, ForeignKey, BelongsTo} from 'sequelize-typescript';
import { Service } from '../../services/models/service.model';
import { Contract } from '../../contracts/models/contract.model';

@Table
export class Schedule extends Model {
    @AllowNull(false)
    @Column
    state: string;

    @AllowNull(false)
    @Column({type: 'jsonb'})
    properties: string;

    @AllowNull(false)
    @ForeignKey(() => Service)
    @Column
    serviceId: number

    @BelongsTo(() => Service)
    service: Service

    @AllowNull(false)
    @ForeignKey(() => Contract)
    @Column
    contractId: number

    @BelongsTo(() => Contract)
    contract: Contract
}