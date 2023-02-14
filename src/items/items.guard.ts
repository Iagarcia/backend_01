import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';


import { Item } from './models/item.model';
import { Observable } from 'rxjs';
import * as jose from 'jose';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private configService: ConfigService
    ) {}
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const key = this.configService.get<string>('jwt.key');
        return validateAuth(request, key);
    }
}

async function validateAuth(request: Request, key: string) {
    try {
        const jwt = request.headers['authorization'].split(" ")[1];
        if (!jwt) {
            return (false);
        }
        const secret = await new TextEncoder().encode(key);
        const { payload } = await jose.jwtVerify(jwt, secret);
        if (payload.id) {
            return (true);
        }
        return (false);
    }
    catch (e) {
        console.log(e)
        return (false)
    }
}

@Injectable()
export class ProviderGuard implements CanActivate {
    constructor(private configService: ConfigService) {}
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const key = this.configService.get<string>('jwt.key');
        return validateProvider(request, key);
    }
}

async function validateProvider(request: Request, key: string) {
    try {
        const jwt = request.headers['authorization'].split(" ")[1];
        if (!jwt) {
            return (false);
        }
        const secret = await new TextEncoder().encode(key);
        const { payload } = await jose.jwtVerify(jwt, secret);
        if (payload.id && payload.type === "provider") {
            return (true);
        }
        return (false);
    }
    catch (e) {
        return (false)
    }
}

@Injectable()
export class OwnGuard implements CanActivate {
    constructor(
        private configService: ConfigService,
        @InjectModel(Item)
        private readonly itemModel: typeof Item
    ) {}
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const key = this.configService.get<string>('jwt.key');
        const body = request.body;
        console.log("BODY", body)
        return validateOwn(request, key, this.itemModel, body);
    }
}

async function validateOwn(request: Request, key: string, itemModel: typeof Item, body: any) {
    try {
        const jwt = request.headers['authorization'].split(" ")[1];
        if (!jwt) {
            return (false);
        }
        const secret = new TextEncoder().encode(key);
        const { payload } = await jose.jwtVerify(jwt, secret);
        if (payload.type === "provider"){
            const items = await itemModel.findAll({
                where: {providerId: payload.id}
            })
            const itemsId = items.map(item => {return item.id});
            return itemsId.includes(body.id);
        }
        return (false)
    }
    catch (e) {
        console.log(e)
        return (false)
    }
}