import { Injectable, InternalServerErrorException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { UpdateItemPhotosDto } from './dto/update-item-photos.dto';
import { DeleteItemDto } from './dto/delete-item.dto';

import { Item } from './models/item.model';
import * as jose from 'jose';
import { join } from 'path';
import { of } from "rxjs";
import { getReasonPhrase, ReasonPhrases, StatusCodes } from "http-status-codes";

@Injectable()
export class ItemsService {
    constructor(
        private configService: ConfigService,
        @InjectModel(Item)
        private readonly itemModel: typeof Item,
    ) {}

async create(itemDto: CreateItemDto, headers: Headers) {
    try {
        const jwt = headers['authorization'].split(" ")[1];
        const jwtKey = this.configService.get<string>('jwt.key');
        const secret = new TextEncoder().encode(jwtKey);
        const { payload } = await jose.jwtVerify(jwt, secret);
        const item = await this.itemModel.create({
            title: itemDto.title,
            description: itemDto.description,
            currency: itemDto.currency,
            unitCost: itemDto.unitCost,
            properties: itemDto.properties ? itemDto.properties : {},
            providerId: payload.id,
        })
        return ({
            status: StatusCodes.CREATED,
            send: ReasonPhrases.CREATED,
            data: item
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
        const items = await this.itemModel.findAll({
            where: {providerId: payload.id}
        })
        return ({
            status: StatusCodes.OK,
            send: ReasonPhrases.OK,
            data: items
        })

    }
    catch (error) {
        throw new InternalServerErrorException()
    }
}

async updateData(itemDto: UpdateItemDto) {
    try {
        const item = await this.itemModel.findOne({
            where: {id: itemDto.id}
        });
        await item.update({
            title: itemDto.title,
            description: itemDto.description,
            currency: itemDto.currency,
            unitCost: itemDto.unitCost,
            properties: itemDto.properties,
        })
        await item.save();
        return ({
            status: StatusCodes.OK,
            send: ReasonPhrases.OK,
        })
    }
    catch (error) {
        throw new InternalServerErrorException()
    }
}

async updatePhotos(photosDto:UpdateItemPhotosDto, headers, files:any[]){
    try {
        const jwt = headers['authorization'].split(" ")[1];
        const jwtKey = this.configService.get<string>('jwt.key');
        const secret = new TextEncoder().encode(jwtKey);
        const { payload } = await jose.jwtVerify(jwt, secret);
        const items = await this.itemModel.findAll({
            where: {providerId: payload.id}
        })
        const itemsId = items.map(item => {return item.id})
        const id = Number(photosDto.id);
        if (!itemsId.includes(id)){
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
                        const path = './uploads/item_'+id+'_'+file.originalname;
                        fs.writeFile(path, file.buffer, (err) => {
                            if (err) throw err;
                        });
                        filesUploaded.push('item_'+id+'_'+file.originalname)
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
            const item = await this.itemModel.findOne({
                where: {id: id}
            });
            const properties = item.properties;
            properties["photos"] = filesUploaded;
            await item.update({
                properties: JSON.stringify(properties),
            })
            await item.save();
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
        return of(res.sendFile(join(process.cwd(), './uploads/' + filename), function (error) {
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

async delete(deleteServiceDto:DeleteItemDto){
    try {
        const item = await this.itemModel.findOne({
            where: {id: deleteServiceDto.id}
        })
        await item.destroy();
        return ({
            status: StatusCodes.GONE,
            send: ReasonPhrases.GONE,
            data: {
                message: "Item deleted",
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
