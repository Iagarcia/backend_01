import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jose from 'jose';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return validateAuth(request);
    }
}

async function validateAuth(request: Request) {
    try {
        const jwt = request.headers['authorization'].split(" ")[1];
        if (!jwt) {
            return (false);
        }
        const secret = await new TextEncoder().encode(
            "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
        );
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
export class ProviderGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return validateProvider(request);
    }
}

async function validateProvider(request: Request) {
    try {
        const jwt = request.headers['authorization'].split(" ")[1];
        if (!jwt) {
            return (false);
        }
        const secret = await new TextEncoder().encode(
            "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
        );
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

