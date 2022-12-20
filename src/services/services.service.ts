import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceGeneralDataDto} from "./dto/update-service-general-data.dto";
import { UpdateServicePaymentDataDto } from "./dto/update-service-payment-data.dto";
import { UpdateServicePropertiesDto } from "./dto/update-service-properties.dto";
import { UpdateServicePhotosDto } from "./dto/update-service-photos.dto";
import { DeleteServiceDto } from "./dto/delete-service.dto";
import { FilterServiceDto } from "./dto/filter-service.dto";

import { Service } from './models/service.model';

import * as jose from "jose";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { Schedule } from "../schedules/models/schedule.model"

@Injectable()
export class ServicesService {
    constructor(
        @InjectModel(Service)
        private readonly serviceModel: typeof Service,
    ) {}

    async create(createServiceDto: CreateServiceDto, headers){
        try {
            const jwt = headers['authorization'].split(" ")[1];
            const secret = await new TextEncoder().encode(
                "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
            );
            const { payload } = await jose.jwtVerify(jwt, secret);
            const service = await this.serviceModel.create({
                title: createServiceDto.title,
                description: createServiceDto.description,
                currency: createServiceDto.currency,
                unitCost: createServiceDto.unitCost,
                providerId: payload.id,
                properties: createServiceDto.properties,
            })
            return ({
                status: StatusCodes.CREATED,
                send: ReasonPhrases.CREATED,
                data: service
            })
        }
        catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError'){
                return ({
                    status: StatusCodes.BAD_REQUEST,
                    send: ReasonPhrases.BAD_REQUEST,
                    data: {
                        error: error.toString(),
                        message: error.parent.detail,
                    }
                })
            }
            else if (error.name === 'SequelizeValidationError'){
                return ({
                    status: StatusCodes.BAD_REQUEST,
                    send: ReasonPhrases.BAD_REQUEST,
                    data: {
                        error: error.toString(),
                        message: error.errors[0].path+" no puede estar vacío",
                    }
                })
            }
            else {
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

    async requestServices(headers){
        try {
            const jwt = headers['authorization'].split(" ")[1];
            const secret = await new TextEncoder().encode(
                "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
            );
            const { payload } = await jose.jwtVerify(jwt, secret);
            const services = await this.serviceModel.findAll({
                where: {providerId: payload.id}
            })
            return ({
                status: StatusCodes.OK,
                send: ReasonPhrases.OK,
                data: services
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

    async updateGeneralData(generalDataDto:UpdateServiceGeneralDataDto){
        try {
            const service = await this.serviceModel.findOne({
                where: {id: generalDataDto.id}
            });
            await service.update({
                title: generalDataDto.title,
                description: generalDataDto.description,
            })
            await service.save();
            return ({
                status: StatusCodes.OK,
                send: ReasonPhrases.OK,
                data: {
                    message: "Información general actualizada",
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

    async updatePaymentData(paymentDataDto:UpdateServicePaymentDataDto){
        try {
            const service = await this.serviceModel.findOne({
                where: {id: paymentDataDto.id}
            });
            await service.update({
                currency: paymentDataDto.currency,
                unitCost: paymentDataDto.unitCost,
            })
            await service.save();
            return ({
                status: StatusCodes.OK,
                send: ReasonPhrases.OK,
                data: {
                    message: "Información de pago actualizada",
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

    async updateServiceProperties(propertiesDto:UpdateServicePropertiesDto){
        try {
            const service = await this.serviceModel.findOne({
                where: {id: propertiesDto.id}
            });
            await service.update({
                properties: propertiesDto.properties,
            })
            await service.save();
            return ({
                status: StatusCodes.OK,
                send: ReasonPhrases.OK,
                data: {
                    message: "Propiedades actualizadas",
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

    async updateServicePhotos(photosDto:UpdateServicePhotosDto, headers, files:any[]){
        try {
            const jwt = headers['authorization'].split(" ")[1];
            const secret = await new TextEncoder().encode(
                "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
            );
            const { payload } = await jose.jwtVerify(jwt, secret);
            const services = await Service.findAll({
                where: {providerId: payload.id}
            })
            const servicesId = services.map(service => {return service.id})
            const id = Number(photosDto.id);
            if (!servicesId.includes(id)){
                return ({
                    status: StatusCodes.FORBIDDEN,
                    send: ReasonPhrases.FORBIDDEN,
                })
            }
            else {
                const filesUploaded = []
                files.forEach(file => {
                    if(file.mimetype.split('/')[0]==='image'){
                        if(file.size < 10000000){
                            const fs = require("fs");
                            const path = './uploads/service_'+id+'_'+file.originalname;
                            fs.writeFile(path, file.buffer, (err) => {
                                if (err) throw err;
                            });
                            filesUploaded.push('service_'+id+'_'+file.originalname)
                        }
                        else {
                            return ({
                                error: "El archivo excede tamaño máximo permitido"
                            })
                        }
                    }
                    else {
                        return ({
                            error: "El archivo no es una foto"
                        })
                    }
                })

                const service = await this.serviceModel.findOne({
                    where: {id: id}
                });
                const properties = service.properties;
                properties["photos"] = filesUploaded;
                await service.update({
                    properties: JSON.stringify(properties),
                })
                await service.save();
                return ({
                    status: StatusCodes.OK,
                    send: ReasonPhrases.OK,
                    data: {
                        message: "Fotos de servicio actualizadas",
                    }
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

    async getService(id:number){
        try {
            const service = await this.serviceModel.findOne({
                where: {id: id},
                include: ["provider"],
            })
            const jsonService = JSON.parse(JSON.stringify(service));
            delete jsonService.provider.password;
            return ({
                status: StatusCodes.OK,
                send: ReasonPhrases.OK,
                data: jsonService
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

    async delete(deleteServiceDto:DeleteServiceDto){
        try {
            const service = await this.serviceModel.findOne({
                where: {id: deleteServiceDto.id},
                include: [Schedule]
            })
            if (service.schedules.length > 0){
                return ({
                    status: StatusCodes.BAD_REQUEST,
                    send: ReasonPhrases.BAD_REQUEST,
                    data: {
                        message: "Servicio tiene Agendamientos",
                    }
                })
            }
            await service.destroy();
            return ({
                status: StatusCodes.GONE,
                send: ReasonPhrases.GONE,
                data: {
                    message: "Servicio eliminado",
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

    async filter(filterServiceDto:FilterServiceDto){
        try {
            const services = await this.serviceModel.findAll()
            const filterServices = [];
            if (filterServiceDto.specialty && filterServiceDto.location){
                services.forEach(service => {
                    if (service.properties["specialty"] === filterServiceDto.specialty &&
                        service.properties["location"] === filterServiceDto.location){
                        filterServices.push(service);
                    }
                })
            }
            else if (filterServiceDto.specialty){
                services.forEach(service => {
                    if (service.properties["specialty"] === filterServiceDto.specialty){
                        filterServices.push(service);
                    }
                })
            }
            else if (filterServiceDto.location){
                services.forEach(service => {
                    if (service.properties["location"] === filterServiceDto.location){
                        filterServices.push(service);
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
                    filterServices: filterServices
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
