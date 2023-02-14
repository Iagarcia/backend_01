import {DataType, Column, Model, Table, BelongsTo, ForeignKey, AllowNull, HasMany} from 'sequelize-typescript';
import { Client }  from '../../clients/models/client.model';
//import { Schedule } from "../../schedules/models/schedule.model";

@Table
export class Request extends Model {
    //GENERAL DATA
    @AllowNull(false)
    @Column
    place: string;

    @AllowNull(false)
    @Column
    date: Date;

    //PURCHASE DATA
    @AllowNull(false)
    @Column
    paymentMethod: string; //cash or quota

    @AllowNull(false)
    @Column(DataType.FLOAT)
    amount: number;

    //EXTRA DATA
    @AllowNull(false)
    @Column({type: 'jsonb'})
    properties: string;

    @AllowNull(false)
    @ForeignKey(() => Client)
    @Column
    clientId: number

    @BelongsTo(() => Client)
    client: Client
/*
    @HasMany(() => Schedule)
    schedules: Schedule[]
*/
}