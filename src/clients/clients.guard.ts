import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jose from 'jose';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return validateRequest(request);
    }
}

async function validateRequest(request){
    try {
        const jwt = request.headers['authorization'].split(" ")[1];
        if (!jwt) {
            return(false);
        }
        const secret = await new TextEncoder().encode(
            "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
        );
        const { payload } = await jose.jwtVerify(jwt, secret);

        if (payload.id && payload.type === "client"){
            return(true);
        }
        return(false);
    }
    catch (e) {
        return(false)
    }
}

@Injectable()
export class AgainGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return againRequest(request);
    }
}

async function againRequest(request){
    try {
        const jwt = request.headers['authorization'].split(" ")[1];
        const body = request.body;
        if (!jwt) {
            return(false);
        }
        const secret = await new TextEncoder().encode(
            "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
        );
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
