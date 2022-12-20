import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateClientDto } from './dto/create-client.dto';
import { AuthenticateClientDto } from "./dto/authenticate-client.dto";
import { ReauthenticateClientDto } from "./dto/reauthenticate-client.dto";
import { RecoverClientDto } from "./dto/recover-client.dto";
import { UpdateClientPersonalDataDto } from "./dto/update-client-personal-data.dto";
import { UpdateClientContactDataDto } from "./dto/update-client-contact-data.dto";
import { UpdateClientPropertiesDataDto } from "./dto/update-client-properties-data.dto";

import { Client } from './models/client.model';

import * as bcrypt from "bcrypt";
import * as jose from 'jose';
import { ReasonPhrases, StatusCodes } from "http-status-codes";

@Injectable()
export class ClientsService {
    constructor(
        @InjectModel(Client)
        private readonly clientModel: typeof Client,
    ) {}

    async create(createClientDto: CreateClientDto) {
        try{
            const salt = await bcrypt.genSalt();
            console.log(salt);
            const password = createClientDto.password;
            console.log(password);
            const hash = await bcrypt.hash(password, salt);
            //const isMatch = await bcrypt.compare(password, hash);
            //console.log(isMatch)
            console.log(hash);
            const properties = {
                description: '',
                education : [],
                work: [],
                agreement: [],
                photo: '',
            }
            const client = await this.clientModel.create({
                name: createClientDto.name,
                rut: createClientDto.rut,
                email: createClientDto.email,
                phone: createClientDto.phone,
                nationality: createClientDto.nationality,
                address: createClientDto.address,
                birthday: createClientDto.birthday,
                password: hash,
                properties: properties
            })
            return ({
                status: StatusCodes.CREATED,
                send: ReasonPhrases.CREATED,
                data: {
                    email: client.email
                }
            })
        }
        catch (error) {
            console.log(error.name);
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

    async authenticate(authenticateClientDto: AuthenticateClientDto){
        try {
            const account = await this.clientModel.findOne({
                where: {email: authenticateClientDto.email},
            });
            if (account) {
                const isMatch = await bcrypt.compare(authenticateClientDto.password, account.password);
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
                        type: "client"
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

    async reauthenticate(reauthenticateClientDto: ReauthenticateClientDto, headers){
        try {
            const account = await this.clientModel.findOne({
                where: {email: reauthenticateClientDto.email},
            });
            if (account) {
                if (reauthenticateClientDto.password === account.password) {
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
                        type: "client",
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
            const account = await this.clientModel.findOne({
                where: {id: payload.id},
            });
            const client = {
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
		type: "client",
            }
            return ({
                status: StatusCodes.OK,
                send: ReasonPhrases.OK,
                data: client
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

    async recover(recoverDto: RecoverClientDto){
        try{
            const client = await this.clientModel.findOne({
                where: {email: recoverDto.email},
            });
            if (client){
                const salt = await bcrypt.genSalt();
                const password = recoverDto.password;
                const hash = await bcrypt.hash(password, salt);
                await client.update({
                    password: hash,
                })
                await client.save();
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

    async updatePersonalData(headers, personalDataDto: UpdateClientPersonalDataDto){
        try{
            const jwt = headers['authorization'].split(" ")[1];
            const secret = await new TextEncoder().encode(
                "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
            );
            const { payload } = await jose.jwtVerify(jwt, secret);
            const client = await this.clientModel.findOne({
                where: {id: payload.id},
            });
            await client.update({
                name: personalDataDto.name,
                rut: personalDataDto.rut,
                nationality: personalDataDto.nationality,
                birthday: personalDataDto.birthday,
            })
            await client.save();
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

    async updateContactData(headers, contactDataDto: UpdateClientContactDataDto){
        try{
            const jwt = headers['authorization'].split(" ")[1];
            const secret = await new TextEncoder().encode(
                "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
            );
            const { payload } = await jose.jwtVerify(jwt, secret);
            const client = await this.clientModel.findOne({
                where: {id: payload.id},
            });
            await client.update({
                email: contactDataDto.email,
                phone: contactDataDto.phone,
                address: contactDataDto.address,
            })
            await client.save();
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

    async updatePropertiesData(headers, propertiesDataDto: UpdateClientPropertiesDataDto){
        try{
            const jwt = headers['authorization'].split(" ")[1];
            const secret = await new TextEncoder().encode(
                "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
            );
            const { payload } = await jose.jwtVerify(jwt, secret);
            const client = await this.clientModel.findOne({
                where: {id: payload.id},
            });
            await client.update({
                properties: propertiesDataDto.properties,
            })
            await client.save();
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
            const path = './uploads/client_'+payload.id+'_'+file.originalname;
            fs.writeFile(path, file.buffer, (err) => {
                if (err) throw err;
            });
            const client = await this.clientModel.findOne({
                where: {id: payload.id},
            });
            const properties = client.properties;
            properties["photo"] = 'client_'+payload.id+'_'+file.originalname;
            await client.update({
                properties: JSON.stringify(properties),
            });
            await client.save();
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
}
