import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

import { FilterItemDto } from './dto/filter-item.dto';
import { UpdateDeliveryStateDto } from './dto/update-delivery-state.dto';
import { RetriveAccountDto } from './dto/retrieve-account.dto';

import { Delivery } from 'src/deliveries/models/delivery.model';
import { Item } from 'src/items/models/item.model';
import { Request } from 'src/requests/models/request.model';
import { Provider } from 'src/providers/models/provider.model';
import { Client } from 'src/clients/models/client.model';

import { ReasonPhrases, StatusCodes } from "http-status-codes";
import * as jose from 'jose';

@Injectable()
export class VidatService {
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

    async filterProperties(filter:FilterItemDto){
        try {
            const items = await this.itemModel.findAll()
            const filteredItems = [];
            if (filter.specialty && filter.location){
                items.forEach(item => {
                    if (item.properties["specialty"] === filter.specialty &&
                        item.properties["location"] === filter.location){
                        filteredItems.push(item);
                    }
                })
            }
            else if (filter.specialty){
                items.forEach(item => {
                    if (item.properties["specialty"] === filter.specialty){
                        filteredItems.push(item);
                    }
                })
            }
            else if (filter.location){
                items.forEach(item => {
                    if (item.properties["location"] === filter.location){
                        filteredItems.push(item);
                    }
                })
            }
            else {
                return ({
                    status: StatusCodes.OK,
                    send: ReasonPhrases.OK,
                    data: {
                        message: "Filtro vacío",
                    }
                })
            }
            return ({
                status: StatusCodes.OK,
                send: ReasonPhrases.OK,
                data: {
                    filteredItems: filteredItems
                }
            })
        }
        catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async updateDeliveryState(delivery: UpdateDeliveryStateDto){
        try {
            const schedule = await this.deliveryModel.findOne({
                where: {id: delivery.id},
            });
            await schedule.update({
                state: delivery.state
            });
            await schedule.save();
            return ({
                status: StatusCodes.OK,
                send: ReasonPhrases.OK,
                data: {
                    message: "Delivery state updated",
                }
            })
        }
        catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async retrieveAccount(retrieve: RetriveAccountDto){
        try {
            let account: any;
            if (retrieve.type === "provider"){
                account = await this.providerModel.findOne({
                    where: {email: retrieve.email},
                });
            }
            else if (retrieve.type === "client"){
                account = await this.clientModel.findOne({
                    where: {email: retrieve.email},
                });
            }
            else {
                throw new BadRequestException("Account type error");
            }
            const jwtKey = this.configService.get<string>('jwt.key');
            const algorithm = this.configService.get<string>('jwt.alg');
            const expirationTime = this.configService.get<string>('jwt.exp');
            const secret = new TextEncoder().encode(jwtKey); 
            const jwt = await new jose.SignJWT({
                id: account.id,
                name: account.name,
                rut: account.rut,
                nationality: account.nationality,
                birthday: account.birthday,
                email: account.email,
                phone: account.phone,
                address: account.address,
                properties: account.properties,
                password: account.password,
                type: retrieve.type,
            })
            .setProtectedHeader({ alg: algorithm })
            .setExpirationTime(expirationTime)
            .sign(secret);

            return ({
                status: StatusCodes.OK,
                send: ReasonPhrases.OK,
                data: {
                    token: jwt
                }
            })
        }
        catch (error) {
            if (error.status === StatusCodes.BAD_REQUEST) {
                throw new BadRequestException()
            }
            throw new InternalServerErrorException()
        }
    }

    async getItem(id:number){
        try {
            const item = await this.itemModel.findOne({
                where: {id: id},
                include: ["provider"],
            })
            const jsonService = JSON.parse(JSON.stringify(item));
            delete jsonService.provider.password;
            return ({
                status: StatusCodes.OK,
                send: ReasonPhrases.OK,
                data: jsonService
            })
        }
        catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async requestProvider(id:number) {
        try {

            const provider = await this.providerModel.findAll({
                where: {id: id},
                include: [{
                    model: this.itemModel,
                    include: [{
                        model: this.deliveryModel,
                        include: [{
                            model: this.requestModel,
                        }]
                    }]
                }]
            })

            console.log(provider)

            return ({
                status: StatusCodes.OK,
                send: ReasonPhrases.OK,
                data: provider,
            })
        }
        catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getCalendar(headers: Headers){
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
                const items = itemsLoad.map(item => {
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
                const dataFilter = items.filter((service) => service.deliveries.length != 0)
                const ScheduleList = dataFilter.reduce((all, service) => [...all,...service.deliveries] ,[])
                const schedules = ScheduleList.map((schedule) => {
                    if (schedule.request != null){
                        const appointment =schedule.request;
                        return{
                            amount: appointment.amount,
                            date: appointment.date,
                            dayle: schedule.properties,
                            description: appointment.properties.description,
                            id: schedule.id,
                            payment: appointment.paymentMethod,
                            place: appointment.place,
                            state: schedule.state,
                            client: appointment.client
                        }
                    }
                    else {
                        return {
                            amount: -1,
                            client: {
                                id: -1,
                                name: "",
                                tin: "",
                                nationality: "",
                                birthday: new Date(),
                                email: "",
                                phone: -1,
                                address: "",
                                password: "",
                                properties: {
                                    profession: "",
                                    position: "",
                                    photo: "",
                                },
                                type: "",
                            },
                            clientId: -1,
                            date: "",
                            id: -1,
                            paymentMethod: "",
                            place: "",
                            properties: {
                                description: ""
                            },
                        }
                    }

                })
                return ({
                    status: StatusCodes.OK,
                    send: ReasonPhrases.OK,
                    data: schedules
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
                const schedules = requests.map((contract) => {
                    if(contract.deliveries.length != 0){
                        return{
                            contractId: contract.id,
                            amount: contract.amount,
                            date: contract.date,
                            daily: contract.deliveries[0].properties,
                            properties: contract.properties,
                            id: contract.deliveries[0].id,
                            payment: contract.paymentMethod,
                            place: contract.place,
                            state: contract.deliveries[0].state
                        }
                    }
                    else{
                        return{
                            contractId: contract.id,
                            amount: -1,
                            date: "",
                            daily: {
                                start: "",
                                end: "",
                            },
                            properties: "",
                            id: -1,
                            payment: "",
                            place: "",
                            state: "REJECT"
                        }
                    }
                })
                return ({
                    status: StatusCodes.OK,
                    send: ReasonPhrases.OK,
                    data: schedules
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
}
