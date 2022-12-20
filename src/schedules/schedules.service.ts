import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateSchedulePropertiesDto } from './dto/update-schedule-properties.dto';
import { UpdateScheduleStateDto } from './dto/update-schedule-state.dto';
import { DeleteScheduleDto } from './dto/delete-schedule.dto';

import { Schedule } from './models/schedule.model';
import { Service } from "../services/models/service.model"
import { Provider } from "../providers/models/provider.model";
import { Contract } from 'src/contracts/models/contract.model';
import { Client } from 'src/clients/models/client.model';

import * as jose from "jose";
import {ReasonPhrases, StatusCodes} from "http-status-codes";

@Injectable()
export class SchedulesService {
    constructor(
        @InjectModel(Schedule)
        private readonly scheduleModel: typeof Schedule,
        @InjectModel(Service)
        private readonly serviceModel: typeof Service,
        @InjectModel(Provider)
        private readonly providerModel: typeof Provider,
        @InjectModel(Contract)
        private readonly contractModel: typeof Contract,
        @InjectModel(Client)
        private readonly clientModel: typeof Client,
    ) {}

    async create(createScheduleDto: CreateScheduleDto){
        try {
            const schedule = await this.scheduleModel.create({
                state: createScheduleDto.state,
                properties: createScheduleDto.properties,
                serviceId: createScheduleDto.serviceId,
                contractId: createScheduleDto.contractId
            });
            return ({
                status: StatusCodes.CREATED,
                send: ReasonPhrases.CREATED,
                data: {
                    message: "Cita creada",
                    serviceId: schedule.serviceId,
                    contractId: schedule.contractId
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

    async requestSchedules(headers){
        try {
            const jwt = headers['authorization'].split(" ")[1];
            const secret = await new TextEncoder().encode(
                "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
            );
            const { payload } = await jose.jwtVerify(jwt, secret);

            if ( payload.type === "provider" ){
                const serviceRequest = await this.serviceModel.findAll({
                    where: {providerId: payload.id},
                    include: [{
                        model: this.scheduleModel,
                        attributes: ["id", "serviceId", "contractId", "state", "properties"],
                        include: [{
                            model: this.contractModel,
                            attributes: ["id", "place", "description", "payment", "amount", "properties", "clientId"],
                            include: [{
                                model: this.clientModel,
                                attributes: ["id", "name", "rut", "email", "phone", "address", "properties"]
                            }]
                        }]
                    }]
                })
                const services = await serviceRequest.map(service => {
                    return({
                        id: service.id,
                        title: service.title,
                        description: service.description,
                        currency: service.currency,
                        unitCost: service.unitCost,
                        properties: service.properties,
                        schedules: service.schedules
                    })
                })
                return ({
                    status: StatusCodes.OK,
                    send: ReasonPhrases.OK,
                    data: services
                })
            }
            else if ( payload.type === "client" ){
                const contractRequest = await this.contractModel.findAll({
                    where: {clientId: payload.id},
                    include: [{
                        model: this.scheduleModel,
                        attributes: ["id", "serviceId", "contractId", "state", "properties"],
                        include: [{
                            model: this.serviceModel,
                            attributes: ["id", "title", "description", "currency", "unitCost", "properties", "providerId"],
                            include: [{
                                model: this.providerModel,
                                attributes: ["id", "name", "rut", "email", "phone", "address", "properties"]
                            }]
                        }]
                    }]
                })
                const contracts = await contractRequest.map(contract => {
                    return({
                        id: contract.id,
                        place: contract.place,
                        description: contract.description,
                        payment: contract.payment,
                        amount: contract.amount,
                        properties: contract.properties,
                        schedules: contract.schedules
                    })
                })
                return ({
                    status: StatusCodes.OK,
                    send: ReasonPhrases.OK,
                    data: contracts
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

    async updateScheduleState(stateDto: UpdateScheduleStateDto){
        try {
            const schedule = await this.scheduleModel.findOne({
                where: {id: stateDto.id},
            });
            await schedule.update({
                state: stateDto.state
            });
            await schedule.save();
            return ({
                status: StatusCodes.OK,
                send: ReasonPhrases.OK,
                data: {
                    message: "Estado de cita actualizado",
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

    async updateScheduleProperties(propertiesDto: UpdateSchedulePropertiesDto){
        try {
            const schedule = await this.scheduleModel.findOne({
                where: {id: propertiesDto.id},
            });
            await schedule.update({
                properties: propertiesDto.properties
            });
            await schedule.save();
            return ({
                status: StatusCodes.OK,
                send: ReasonPhrases.OK,
                data: {
                    message: "Propiedades de cita actualizado",
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

    async delete(deleteScheduleDto: DeleteScheduleDto){
        try {
            const schedule = await this.scheduleModel.findOne({
                where: {id: deleteScheduleDto.id}
            })
            await schedule.destroy();
            return ({
                status: StatusCodes.GONE,
                send: ReasonPhrases.GONE,
                data: {
                    message: "Agendamiento eliminado",
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

    async requestProvider(id:number) {
        try {
            const services = await this.serviceModel.findAll({
                where: {providerId: id},
                include: ["schedules"],
            })
            return ({
                status: StatusCodes.OK,
                send: ReasonPhrases.OK,
                data: services,
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