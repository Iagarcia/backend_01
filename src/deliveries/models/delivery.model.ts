import { Column, Model, Table, AllowNull, ForeignKey, BelongsTo} from 'sequelize-typescript';
import { Item } from 'src/items/models/item.model'
import { Request } from 'src/requests/models/request.model';

@Table
export class Delivery extends Model {
    @AllowNull(false)
    @Column
    state: string;

    @AllowNull(false)
    @Column({type: 'jsonb'})
    properties: string;

    @AllowNull(false)
    @ForeignKey(() => Item)
    @Column
    itemId: number

    @BelongsTo(() => Item)
    item: Item

    @AllowNull(true)
    @ForeignKey(() => Request)
    @Column
    requestId: number

    @BelongsTo(() => Request)
    request: Request
}