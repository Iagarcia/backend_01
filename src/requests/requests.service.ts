import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { UpdateRequestPhotosDto } from './dto/update-request-photos.dto';
import { DeleteRequestDto } from './dto/delete-request.dto';

import { Request } from './models/request.model';
import * as jose from 'jose';
import { join } from 'path';
import { of } from "rxjs";
import { getReasonPhrase, ReasonPhrases, StatusCodes } from "http-status-codes";

@Injectable()
export class RequestsService {
    constructor(
        private configService: ConfigService,
        @InjectModel(Request)
        private readonly requestModel: typeof Request,
    ) {}

async create(requestDto: CreateRequestDto, headers: Headers) {
    try {
        const jwt = headers['authorization'].split(" ")[1];
        const jwtKey = this.configService.get<string>('jwt.key');
        const secret = new TextEncoder().encode(jwtKey);
        const { payload } = await jose.jwtVerify(jwt, secret);
        const request = await this.requestModel.create({
            place: requestDto.place,
            date: requestDto.date,
            paymentMethod: requestDto.paymentMethod,
            amount: requestDto.amount,
            properties: requestDto.properties ? requestDto.properties : {},
            clientId: payload.id
        })
        return ({
            status: StatusCodes.CREATED,
            send: ReasonPhrases.CREATED,
            data: request
        })
    }
    catch (error) {
        throw new InternalServerErrorException()
    }
}

async getData(headers: Headers) {
    try {
        const jwt = headers['authorization'].split(" ")[1];
        const jwtKey = this.configService.get<string>('jwt.key');
        const secret = new TextEncoder().encode(jwtKey);
        const { payload } = await jose.jwtVerify(jwt, secret);
        const contracts = await this.requestModel.findAll({
            where: {clientId: payload.id}
        })
        return ({
            status: StatusCodes.OK,
            send: ReasonPhrases.OK,
            data: contracts
        })

    }
    catch (error) {
        throw new InternalServerErrorException()
    }
}

async updateData(requestDto: UpdateRequestDto) {
    try {
        const request = await this.requestModel.findOne({
            where: {id: requestDto.id}
        });
        await request.update({
            place: requestDto.place,
            date: requestDto.date,
            paymentMethod: requestDto.paymentMethod,
            amount: requestDto.amount,
            properties: requestDto.properties,
        })
        await request.save();
        return ({
            status: StatusCodes.OK,
            send: ReasonPhrases.OK,
        })
    }
    catch (error) {
        throw new InternalServerErrorException()
    }
}

async updatePhotos(photosDto:UpdateRequestPhotosDto, headers, files:any[]){
    try {
        const jwt = headers['authorization'].split(" ")[1];
        const jwtKey = this.configService.get<string>('jwt.key');
        const secret = new TextEncoder().encode(jwtKey);
        const { payload } = await jose.jwtVerify(jwt, secret);
        const requests = await this.requestModel.findAll({
            where: {clientId: payload.id}
        })
        const requestsId = requests.map(request => {return request.id})
        const id = Number(photosDto.id);
        if (!requestsId.includes(id)){
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
                        const location = this.configService.get<string>('files.images.requests');
                        const path = location + 'request_'+id+'_'+file.originalname;
                        fs.writeFile(path, file.buffer, (err) => {
                            if (err) throw err;
                        });
                        filesUploaded.push('request_'+id+'_'+file.originalname)
                    }
                    else {
                        return ({
                            error: "Size error"
                        })
                    }
                }
                else {
                    return ({
                        error: "Format error"
                    })
                }
            })
            const request = await this.requestModel.findOne({
                where: {id: id}
            });
            const properties = request.properties;
            properties["photos"] = filesUploaded;
            await request.update({
                properties: JSON.stringify(properties),
            })
            await request.save();
            return ({
                status: StatusCodes.OK,
                send: ReasonPhrases.OK,
                data: {
                    message: "Photos updated",
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

async getPhoto(res: any, filename: string) {
    try {
        const location = this.configService.get<string>('files.images.requests');
        return of(res.sendFile(location + filename, function (error) {
            if (error) {
                res.status(StatusCodes.NOT_FOUND)
                res.send({
                    status: error.statusCode,
                    send: getReasonPhrase(error.statusCode),
                })
            }
        }));
    }
    catch (error) {
        throw new InternalServerErrorException()
    }
}

async delete(deleteServiceDto:DeleteRequestDto){
    try {
        const request = await this.requestModel.findOne({
            where: {id: deleteServiceDto.id}
        })
        await request.destroy();
        return ({
            status: StatusCodes.GONE,
            send: ReasonPhrases.GONE,
            data: {
                message: "Request deleted",
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
