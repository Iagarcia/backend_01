import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { Contract } from './models/contract.model';

import { Observable } from 'rxjs';
import * as jose from 'jose';

@Injectable()
export class AccessGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return validateAccess(request);
    }
}

async function validateAccess(request){
    try {
        const jwt = request.headers['authorization'].split(" ")[1];
        if (!jwt) {
            return false;
        }
        const secret = await new TextEncoder().encode(
            "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
        );
        const { payload } = await jose.jwtVerify(jwt, secret);
        return payload.id && payload.type === "client";

    }
    catch (e) {
        return false
    }
}

@Injectable()
export class OwningGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return validateOwning(request);
    }
}

async function validateOwning(request){
    try {
        const jwt = request.headers['authorization'].split(" ")[1];
        if (!jwt) {
            return false;
        }
        const secret = await new TextEncoder().encode(
            "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
        );
        const { payload } = await jose.jwtVerify(jwt, secret);
        const contracts = await Contract.findAll({
            where: {clientId: payload.id}
        })
        const contractsId = contracts.map(contract => {return contract.id})
        const body = request.body;
        return contractsId.includes(body.id);
    }
    catch (e) {
        return false
    }
}

@Injectable()
export class ProviderGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return validateProvider(request);
    }
}

async function validateProvider(request){
    try {
        const jwt = request.headers['authorization'].split(" ")[1];
        if (!jwt) {
            return false;
        }
        const secret = await new TextEncoder().encode(
            "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
        );
        const { payload } = await jose.jwtVerify(jwt, secret);
        return payload.id && payload.type === "provider";

    }
    catch (e) {
        return false
    }
}