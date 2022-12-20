import { Injectable} from '@nestjs/common';
import { InjectModel} from '@nestjs/sequelize';

import { CreateContractDto} from './dto/create-contract.dto';
import { UpdateContractGeneralDataDto } from "./dto/update-contract-general-data.dto";
import { UpdateContractPurchaseDataDto } from "./dto/update-contract-purchase-data.dto";
import { UpdateContractPropertiesDto } from "./dto/update-contract-properties.dto";
import { UpdateContractPhotosDto } from "./dto/update-contract-photos.dto";
import { DeleteContractDto } from "./dto/delete-contract.dto";

import { Contract} from './models/contract.model';

import * as jose from "jose";
import { ReasonPhrases, StatusCodes} from "http-status-codes";

@Injectable()
export class ContractsService {
    constructor(
        @InjectModel(Contract)
        private readonly contractModel: typeof Contract,
    ) {}

    async create(createContractDto: CreateContractDto, headers){
        try {
            const jwt = headers['authorization'].split(" ")[1];
            const secret = await new TextEncoder().encode(
                "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
            );
            const { payload } = await jose.jwtVerify(jwt, secret);
            const properties = {};
            const contract = await this.contractModel.create({
                place: createContractDto.place,
                description: createContractDto.description,
                payment: createContractDto.payment,
                amount: createContractDto.amount,
                properties: properties,
                clientId: payload.id
            })
            return ({
                status: StatusCodes.CREATED,
                send: ReasonPhrases.CREATED,
                data: contract
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

    async requestContracts(headers){
        try {
            const jwt = headers['authorization'].split(" ")[1];
            const secret = await new TextEncoder().encode(
                "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
            );
            const { payload } = await jose.jwtVerify(jwt, secret);
            const contracts = await this.contractModel.findAll({
                where: {clientId: payload.id}
            })
            return ({
                status: StatusCodes.OK,
                send: ReasonPhrases.OK,
                data: contracts
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

    async updateGeneralData(generalDataDto:UpdateContractGeneralDataDto){
        try {
            const contract = await this.contractModel.findOne({
                where: {id: generalDataDto.id}
            });
            await contract.update({
                place: generalDataDto.place,
                description: generalDataDto.description,
            })
            await contract.save();
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

    async updatePurchaseData(paymentDataDto:UpdateContractPurchaseDataDto){
        try {
            const contract = await this.contractModel.findOne({
                where: {id: paymentDataDto.id}
            });
            await contract.update({
                payment: paymentDataDto.payment,
                amount: paymentDataDto.amount,
            })
            await contract.save();
            return ({
                status: StatusCodes.OK,
                send: ReasonPhrases.OK,
                data: {
                    message: "Información de compra actualizada",
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

    async updateContractProperties(propertiesDto:UpdateContractPropertiesDto){
        try {
            const contract = await this.contractModel.findOne({
                where: {id: propertiesDto.id}
            });
            await contract.update({
                properties: propertiesDto.properties,
            })
            await contract.save();
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

    async updateContractPhotos(photosDto:UpdateContractPhotosDto, headers, files:any[]){
        try {
            const jwt = headers['authorization'].split(" ")[1];
            const secret = await new TextEncoder().encode(
                "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
            );
            const { payload } = await jose.jwtVerify(jwt, secret);
            const contracts = await Contract.findAll({
                where: {clientId: payload.id}
            })

            const contractsId = contracts.map(contract => {return contract.id})
            const id = Number(photosDto.id);
            if (!contractsId.includes(id)){
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
                            const path = './uploads/contract_'+id+'_'+file.originalname;
                            fs.writeFile(path, file.buffer, (err) => {
                                if (err) throw err;
                            });
                            filesUploaded.push('contract_'+id+'_'+file.originalname)
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

                const contract = await this.contractModel.findOne({
                    where: {id: id}
                });
                const properties = contract.properties;
                properties["photos"] = filesUploaded;
                await contract.update({
                    properties: JSON.stringify(properties)
                })
                await contract.save();
                return ({
                    status: StatusCodes.OK,
                    send: ReasonPhrases.OK,
                    data: {
                        message: "Fotos de contrato actualizadas",
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

    async getContract(id:number){
        try {
            console.log("GET SERVICE: ",id)
            const contract = await this.contractModel.findOne({
                where: {id: id},
                include: ["client"],
            })
            const jsonContract = JSON.parse(JSON.stringify(contract));
            delete jsonContract.client.password;
            return ({
                status: StatusCodes.OK,
                send: ReasonPhrases.OK,
                data: jsonContract
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

    async delete(deleteContractDto:DeleteContractDto){
        try {
            const contract = await this.contractModel.findOne({
                where: {id: deleteContractDto.id}
            })
            await contract.destroy();
            return ({
                status: StatusCodes.GONE,
                send: ReasonPhrases.GONE,
                data: {
                    message: "Contrato eliminado",
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
