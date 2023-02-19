import { DataType, Column, Model, Table, ForeignKey, BelongsTo, AllowNull, HasMany} from 'sequelize-typescript';
import { Provider } from 'src/providers/models/provider.model';
import { Delivery } from 'src/deliveries/models/delivery.model';

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

    @HasMany(() => Delivery)
    deliveries: Delivery[]

}