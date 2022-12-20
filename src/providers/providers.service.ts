import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateProviderDto } from './dto/create-provider.dto';
import { AuthenticateProviderDto } from "./dto/authenticate-provider.dto";
import { ReauthenticateProviderDto } from "./dto/reauthenticate-provider.dto";
import { RecoverProviderDto } from "./dto/recover-provider.dto";
import { UpdateProviderPersonalDataDto } from "./dto/update-provider-personal-data.dto";
import { UpdateProviderContactDataDto } from "./dto/update-provider-contact-data.dto";
import { UpdatePropertiesDataDto } from "./dto/update-properties-data.dto";

import { Provider } from './models/provider.model';
import * as bcrypt from 'bcrypt';
import * as jose from 'jose';
import { ReasonPhrases, StatusCodes }from 'http-status-codes';

@Injectable()
export class ProvidersService {
    constructor(
        @InjectModel(Provider)
        private readonly providerModel: typeof Provider,
    ) {}

    async create(createProviderDto: CreateProviderDto){
        try{
            const salt = await bcrypt.genSalt();
            const password = createProviderDto.password;
            const hash = await bcrypt.hash(password, salt);
            const properties = {
                description: '',
                education : [],
                work: [],
                agreement: [],
                photo: '',
            }
            const provider = await this.providerModel.create({
                name: createProviderDto.name,
                rut: createProviderDto.rut,
                email: createProviderDto.email,
                phone: createProviderDto.phone,
                nationality: createProviderDto.nationality,
                address: createProviderDto.address,
                birthday: createProviderDto.birthday,
                password: hash,
                properties: properties
            })
            return ({
                status: StatusCodes.CREATED,
                send: ReasonPhrases.CREATED,
                data: {
                    email: provider.email
                }
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

    async authenticate(authenticateProviderDto: AuthenticateProviderDto){
        try {
            const account = await this.providerModel.findOne({
                where: {email: authenticateProviderDto.email},
            });
            if (account) {
                const isMatch = await bcrypt.compare(authenticateProviderDto.password, account.password);
                if (isMatch) {
                    const secret = await new TextEncoder().encode(
                        "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
                    );

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
                        type: "provider",
                    })
                        .setProtectedHeader({ alg: "HS256" })
                        .setExpirationTime('2h')
                        .sign(secret);

                    return ({
                        status: StatusCodes.OK,
                        send: ReasonPhrases.OK,
                        data: {
                            message: "Usuario autenticado",
                            token: jwt
                        }
                    })
                }
                else {
                    return ({
                        status: StatusCodes.BAD_REQUEST,
                        send: ReasonPhrases.BAD_REQUEST,
                        data: {
                            error: "Contraseña incorrecta",
                        }
                    })
                }
            }
            else {
                return ({
                    status: StatusCodes.BAD_REQUEST,
                    send: ReasonPhrases.BAD_REQUEST,
                    data: {
                        error: "Usuario no encontrado   ",
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

    async reauthenticate(reauthenticateProviderDto: ReauthenticateProviderDto, headers){
        try {
            const account = await this.providerModel.findOne({
                where: {email: reauthenticateProviderDto.email},
            });
            if (account) {
                if (reauthenticateProviderDto.password === account.password) {
                    const secret = await new TextEncoder().encode(
                        "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
                    );
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
                        type: "provider",
                    })
                        .setProtectedHeader({ alg: "HS256" })
                        .setExpirationTime('2h')
                        .sign(secret);

                    return ({
                        status: StatusCodes.OK,
                        send: ReasonPhrases.OK,
                        data: {
                            message: "Usuario reautenticado",
                            token: jwt
                        }
                    })
                }
                else {
                    return ({
                        status: StatusCodes.BAD_REQUEST,
                        send: ReasonPhrases.BAD_REQUEST,
                        data: {
                            error: "Contraseña incorrecta",
                        }
                    })
                }
            }
            else {
                return ({
                    status: StatusCodes.BAD_REQUEST,
                    send: ReasonPhrases.BAD_REQUEST,
                    data: {
                        error: "Usuario no encontrado   ",
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

    async requestData(headers){
        try {
            const jwt = headers['authorization'].split(" ")[1];
            const secret = await new TextEncoder().encode(
                "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
            );
            const { payload } = await jose.jwtVerify(jwt, secret);
            const account = await this.providerModel.findOne({
                where: {id: payload.id},
            });
            const provider = {
                id: account.id,
                name: account.name,
                rut: account.rut,
                nationality: account.nationality,
                birthday: account.birthday,
                email: account.email,
                phone: account.phone,
                address: account.address,
		password: account.password,
                properties: account.properties,
		type: "provider",
            }
            return ({
                status: StatusCodes.OK,
                send: ReasonPhrases.OK,
                data: provider
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

    async recover(recoverDto: RecoverProviderDto){
        try{
            const provider = await this.providerModel.findOne({
                where: {email: recoverDto.email},
            });
            if (provider){
                const salt = await bcrypt.genSalt();
                const password = recoverDto.password;
                const hash = await bcrypt.hash(password, salt);
                await provider.update({
                    password: hash,
                })
                await provider.save();
                return ({
                    status: StatusCodes.OK,
                    send: ReasonPhrases.OK,
                    data: {
                        message: "Contraseña actualizada",
                    }
                })
            }
            return ({
                status: StatusCodes.BAD_REQUEST,
                send: ReasonPhrases.BAD_REQUEST,
                data: {
                    message: "Correo no encontrado",
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

    async updatePersonalData(headers, personalDataDto: UpdateProviderPersonalDataDto){
        try{
            const jwt = headers['authorization'].split(" ")[1];
            const secret = await new TextEncoder().encode(
                "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
            );
            const { payload } = await jose.jwtVerify(jwt, secret);
            const provider = await this.providerModel.findOne({
                where: {id: payload.id},
            });
            await provider.update({
                name: personalDataDto.name,
                rut: personalDataDto.rut,
                nationality: personalDataDto.nationality,
                birthday: personalDataDto.birthday,
            })
            await provider.save();
            return ({
                status: StatusCodes.OK,
                send: ReasonPhrases.OK,
                data: {
                    message: "Información personal actualizada",
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

    async updateContactData(headers, contactDataDto: UpdateProviderContactDataDto){
        try{
            const jwt = headers['authorization'].split(" ")[1];
            const secret = await new TextEncoder().encode(
                "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
            );
            const { payload } = await jose.jwtVerify(jwt, secret);
            const provider = await this.providerModel.findOne({
                where: {id: payload.id},
            });
            await provider.update({
                email: contactDataDto.email,
                phone: contactDataDto.phone,
                address: contactDataDto.address,
            })
            await provider.save();
            return ({
                status: StatusCodes.OK,
                send: ReasonPhrases.OK,
                data: {
                    message: "Información de contacto actualizada",
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

    async updatePropertiesData(headers, propertiesDataDto: UpdatePropertiesDataDto){
        try{
            const jwt = headers['authorization'].split(" ")[1];
            const secret = await new TextEncoder().encode(
                "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
            );
            const { payload } = await jose.jwtVerify(jwt, secret);
            const provider = await this.providerModel.findOne({
                where: {id: payload.id},
            });
            await provider.update({
                properties: propertiesDataDto.properties,
            })
            await provider.save();
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

    async updatePhoto(headers, file){
        try{
            const jwt = headers['authorization'].split(" ")[1];
            const secret = await new TextEncoder().encode(
                "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
            );
            const { payload } = await jose.jwtVerify(jwt, secret);
            const fs = require("fs");
            const path = './uploads/provider_'+payload.id+'_'+file.originalname;
            fs.writeFile(path, file.buffer, (err) => {
                if (err) throw err;
            });
            const provider = await this.providerModel.findOne({
                where: {id: payload.id},
            });
            const properties = provider.properties;
            properties["photo"] = 'provider_'+payload.id+'_'+file.originalname;
            await provider.update({
                properties: JSON.stringify(properties),
            });
            await provider.save();
            return ({
                status: StatusCodes.OK,
                send: ReasonPhrases.OK,
                data: {
                    message: "Foto de perfil actualizada",
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

    async getProvider(id:number){

        try {
            console.log("GET SERVICE: ",id)
            const service = await this.providerModel.findOne({
                where: {id: id},
                include: ["services"],
            })
            console.log("GET SERVICaSDASD: ",service)

            const jsonService = JSON.parse(JSON.stringify(service));
            delete jsonService.rut;
            delete jsonService.nationality;
            delete jsonService.birthday;
            delete jsonService.email;
            delete jsonService.phone;
            delete jsonService.address;
            delete jsonService.properties;
            delete jsonService.password;
            delete jsonService.isActive;
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
}
