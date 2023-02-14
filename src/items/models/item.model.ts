import { DataType, Column, Model, Table, ForeignKey, BelongsTo, AllowNull, HasMany} from 'sequelize-typescript';
import { Provider } from '../../providers/models/provider.model';
//import { Schedule } from '../../schedules/models/schedule.model';

@Table
export class Item extends Model {
    //GENERAL DATA
    @AllowNull(false)
    @Column
    title: string;

    @AllowNull(false)
    @Column
    description: string;

    //PAYMENT DATA
    @AllowNull(false)
    @Column
    currency: string;

    @AllowNull(false)
    @Column(DataType.FLOAT)
    unitCost: number;

    //EXTRA DATA
    @AllowNull(false)
    @Column({type: 'jsonb'})
    properties: string;

    @AllowNull(false)
    @ForeignKey(() => Provider)
    @Column
    providerId: number

    @BelongsTo(() => Provider)
    provider: Provider
/*
    @HasMany(() => Schedule)
    schedules: Schedule[]
*/
}