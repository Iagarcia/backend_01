import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

import { Request as RequestModel } from './models/request.model';
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
        return (false)
    }
}

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
        const secret = await new TextEncoder().encode(key);
        const { payload } = await jose.jwtVerify(jwt, secret);
        if (payload.id && payload.type === "client") {
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
        @InjectModel(RequestModel)
        private readonly requestModel: typeof RequestModel
    ) {}
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const key = this.configService.get<string>('jwt.key');
        const body = request.body;
        return validateOwn(request, key, this.requestModel, body);
    }
}

async function validateOwn(request: Request, key: string, requestModel: typeof RequestModel, body: any) {
    try {
        const jwt = request.headers['authorization'].split(" ")[1];
        if (!jwt) {
            return (false);
        }
        const secret = new TextEncoder().encode(key);
        const { payload } = await jose.jwtVerify(jwt, secret);
        if (payload.type === "client"){
            const requests = await requestModel.findAll({
                where: {clientId: payload.id}
            })
            const requestsId = requests.map(request => {return request.id});
            return requestsId.includes(body.id);
        }
        return (false)
    }
    catch (e) {
        return (false)
    }
}