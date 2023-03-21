import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { Delivery } from 'src/deliveries/models/delivery.model';
import { Item } from 'src/items/models/item.model';
import { Request as RequestModel } from 'src/requests/models/request.model';

import { UpdateDeliveryStateDto } from './dto/update-delivery-state.dto';
import { RetriveAccountDto } from './dto/retrieve-account.dto';

import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import * as jose from 'jose';

@Injectable()
export class ClientGuard implements CanActivate {
    constructor(private configService: ConfigService) {}
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const key = this.configService.get<string>('jwt.key');
        return validateClient(request, key);
    }
}

async function validateClient(request: Request, key: string) {
    try {
        const jwt = request.headers['authorization'].split(" ")[1];
        if (!jwt) {
            return (false);
        }
        const secret = new TextEncoder().encode(key);
        const { payload } = await jose.jwtVerify(jwt, secret);
        return payload.id && payload.type === "client";

    }
    catch (e) {
        return false
    }
}

@Injectable()
export class StateGuard implements CanActivate {
    constructor(private configService: ConfigService) {}
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const key = this.configService.get<string>('jwt.key');
        const body = request.body;
        return validateState(request, key, body);
    }
}

async function validateState(request: Request, key: string, body: UpdateDeliveryStateDto){
    try {
        const jwt = request.headers['authorization'].split(" ")[1];
        if (!jwt) {
            return(false);
        }
        const secret = new TextEncoder().encode(key);
        const { payload } = await jose.jwtVerify(jwt, secret);
        const delivery = await Delivery.findOne({
            where: {id: body.id},
            include: [Item, RequestModel]
        })
        //VERIFY OWNING
        if (payload.type === 'provider'){
            if (delivery.item.providerId !== payload.id){
                return(false)
            }
            if (delivery.state === 'ACCEPT' || delivery.state === 'REJECT' ||
                delivery.state === 'DONE') {
                return(false)
            }
            if (delivery.state === 'SENT' && body.state === 'ACCEPT'){
                return(true)
            }
            if (delivery.state === 'SENT' && body.state === 'REJECT'){
                return(true)
            }
            if (delivery.state === 'CONFIRM' && body.state === 'DONE'){
                return(true)
            }
        }
        else if (payload.type === 'client'){
            if (delivery.request.clientId !== payload.id){
                return(false)
            }
            if (delivery.state === 'SENT' || delivery.state === 'REJECT' ||
                delivery.state === 'CONFIRM' || delivery.state === 'DONE') {
                return(false)
            }
            if (delivery.state === 'ACCEPT' && body.state === 'CONFIRM'){
                return(true)
            }
            if (delivery.state === 'ACCEPT' && body.state === 'REJECT'){
                return(true)
            }
        }
        return(false)
    }
    catch (e) {
        return(false)
    }
}

@Injectable()
export class AgainGuard implements CanActivate {
    constructor(private configService: ConfigService) {}
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const key = this.configService.get<string>('jwt.key');
        const body = request.body;
        return againRequest(request, key, body);
    }
}

async function againRequest(request: Request, key: string, body: RetriveAccountDto){
    try {
        const jwt = request.headers['authorization'].split(" ")[1];
        if (!jwt) {
            return(false);
        }
        const secret = new TextEncoder().encode(key);
        const { payload  } = await jose.compactVerify(jwt, secret);
        const expiredData = JSON.parse(payload.toString());
        if (expiredData.email === body.email){
            return(true)
        }
        return(false);
    }
    catch (e) {
        return(false)
    }
}