import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { DeleteDeliveryDto } from './dto/delete-delivery.dto';

import { Delivery } from './models/delivery.model';
import { Item } from 'src/items/models/item.model';
import { Request } from 'src/requests/models/request.model';
import { Provider } from 'src/providers/models/provider.model';
import { Client } from 'src/clients/models/client.model';

import * as jose from 'jose';
import {ReasonPhrases, StatusCodes} from "http-status-codes";

@Injectable()
export class DeliveriesService {
    constructor(
        private configService: ConfigService,
        @InjectModel(Delivery)
        private readonly deliveryModel: typeof Delivery,
        @InjectModel(Item)
        private readonly itemModel: typeof Item,
        @InjectModel(Provider)
        private readonly providerModel: typeof Provider,
        @InjectModel(Request)
        private readonly requestModel: typeof Request,
        @InjectModel(Client)
        private readonly clientModel: typeof Client,
    ) {}


    async create(deliveryDto: CreateDeliveryDto){
        try {
            const delivery = await this.deliveryModel.create({
                state: deliveryDto.state,
                properties: deliveryDto.properties,
                itemId: deliveryDto.itemId,
                requestId: deliveryDto.requestId
            });
            return ({
                status: StatusCodes.CREATED,
                send: ReasonPhrases.CREATED,
                data: {
                    message: "Delivery created",
                    data: delivery
                }
            })
        }
        catch (error) {
            return ({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                send: ReasonPhrases.INTERNAL_SERVER_ERROR,
                data: {
                    error: error.toString(),
                    message: error.message,
                }
            })
        }
    }

    async getData(headers: Headers){
        try {
            const jwt = headers['authorization'].split(" ")[1];
            const jwtKey = this.configService.get<string>('jwt.key');
            const secret = new TextEncoder().encode(jwtKey);
            const { payload } = await jose.jwtVerify(jwt, secret);

            if ( payload.type === "provider" ){
                const itemsLoad = await this.itemModel.findAll({
                    where: {providerId: payload.id},
                    include: [{
                        model: this.deliveryModel,
                        attributes: ["id", "itemId", "requestId", "state", "properties"],
                        include: [{
                            model: this.requestModel,
                            attributes: ["id", "place", "date", "paymentMethod", "amount", "properties", "clientId"],
                            include: [{
                                model: this.clientModel,
                                attributes: ["id", "name", "tin", "email", "phone", "address", "properties"]
                            }]
                        }]
                    }]
                })
                const items = await itemsLoad.map(item => {
                    return({
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        currency: item.currency,
                        unitCost: item.unitCost,
                        properties: item.properties,
                        deliveries: item.deliveries
                    })
                })
                return ({
                    status: StatusCodes.OK,
                    send: ReasonPhrases.OK,
                    data: items
                })
            }
            else if ( payload.type === "client" ){
                const requestsLoad = await this.requestModel.findAll({
                    where: {clientId: payload.id},
                    include: [{
                        model: this.deliveryModel,
                        attributes: ["id", "itemId", "requestId", "state", "properties"],
                        include: [{
                            model: this.itemModel,
                            attributes: ["id", "title", "description", "currency", "unitCost", "properties", "providerId"],
                            include: [{
                                model: this.providerModel,
                                attributes: ["id", "name", "tin", "email", "phone", "address", "properties"]
                            }]
                        }]
                    }]
                })
                const requests = await requestsLoad.map(request => {
                    return({
                        id: request.id,
                        place: request.place,
                        date: request.date,
                        paymentMethod: request.paymentMethod,
                        amount: request.amount,
                        properties: request.properties,
                        deliveries: request.deliveries
                    })
                })
                return ({
                    status: StatusCodes.OK,
                    send: ReasonPhrases.OK,
                    data: requests
                })
            }
        }
        catch (error) {
            return ({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                send: ReasonPhrases.INTERNAL_SERVER_ERROR,
                data: {
                    error: error.toString(),
                    message: error.message,
                }
            })
        }
    }

    async updateData(deliveryDto: UpdateDeliveryDto) {
        try {
            const delivery = await this.deliveryModel.findOne({
                where: {id: deliveryDto.id},
            });
            await delivery.update({
                state: deliveryDto.state,
                properties: deliveryDto.properties
            });
            await delivery.save();
            return ({
                status: StatusCodes.OK,
                send: ReasonPhrases.OK,
                data: {
                    message: "Delivery updated",
                }
            })
        }
        catch (error) {
            return ({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                send: ReasonPhrases.INTERNAL_SERVER_ERROR,
                data: {
                    error: error.toString(),
                    message: error.message,
                }
            })
        }
    }

    async delete(deliveryDto: DeleteDeliveryDto){
        try {
            const schedule = await this.deliveryModel.findOne({
                where: {id: deliveryDto.id}
            })
            await schedule.destroy();
            return ({
                status: StatusCodes.GONE,
                send: ReasonPhrases.GONE,
                data: {
                    message: "Delivery deleted",
                }
            })
        }
        catch (error) {
            return ({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                send: ReasonPhrases.INTERNAL_SERVER_ERROR,
                data: {
                    error: error.toString(),
                    message: error.message,
                }
            })
        }
    }

}
