import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { Schedule } from "./models/schedule.model";
import { Service } from "../services/models/service.model";
import { Contract } from "../contracts/models/contract.model";

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
            return(false);
        }
        const secret = await new TextEncoder().encode(
            "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
        );
        const { payload } = await jose.jwtVerify(jwt, secret);
        if (payload.id && payload.type){
            return(true);
        }
        return(false);
    }
    catch (e) {
        return(false)
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
            return(false);
        }
        const secret = await new TextEncoder().encode(
            "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
        );
        const { payload } = await jose.jwtVerify(jwt, secret);
        const body = request.body;
        if (payload.type === "provider"){
            if (body.state === 'SENT'){
                return(false);
            }
            const services = await Service.findAll({
                where: {providerId: payload.id}
            })
            const servicesId = services.map(service => {return service.id})
            if (servicesId.includes(body.serviceId)){
                return(true);
            }
            else  {
                return(false);
            }
        }
        else if (payload.type === "client") {
            const contracts = await Contract.findAll({
                where: {clientId: payload.id}
            })
            const contractsId = contracts.map(contract => {return contract.id})
            if (contractsId.includes(body.contractId)){
                return(true);
            }
            else  {
                return(false);
            }
        }
        else {
            return(false);
        }
    }
    catch (e) {
        return(false)
    }
}

@Injectable()
export class StateGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return validateState(request);
    }
}

async function validateState(request){
    try {
        const jwt = request.headers['authorization'].split(" ")[1];
        if (!jwt) {
            return(false);
        }
        const secret = await new TextEncoder().encode(
            "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
        );
        const { payload } = await jose.jwtVerify(jwt, secret);
        const body = request.body;
        const schedule = await Schedule.findOne({
            where: {id: body.id},
            include: [Service, Contract]
        })
        //VERIFY OWNING
        if (payload.type === 'provider'){
            if (schedule.service.providerId !== payload.id){
                return(false)
            }
            if (schedule.state === 'ACCEPT' || schedule.state === 'REJECT' ||
                schedule.state === 'DONE') {
                return(false)
            }
            if (schedule.state === 'SENT' && body.state === 'ACCEPT'){
                return(true)
            }
            if (schedule.state === 'SENT' && body.state === 'REJECT'){
                return(true)
            }
            if (schedule.state === 'CONFIRM' && body.state === 'DONE'){
                return(true)
            }
        }
        else if (payload.type === 'client'){
            if (schedule.contract.clientId !== payload.id){
                return(false)
            }
            if (schedule.state === 'SENT' || schedule.state === 'REJECT' ||
                schedule.state === 'CONFIRM' || schedule.state === 'DONE') {
                return(false)
            }
            if (schedule.state === 'ACCEPT' && body.state === 'CONFIRM'){
                return(true)
            }
            if (schedule.state === 'ACCEPT' && body.state === 'REJECT'){
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
export class PropertiesGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return validateProperties(request);
    }
}

async function validateProperties(request){
    try {
        const jwt = request.headers['authorization'].split(" ")[1];
        if (!jwt) {
            return(false);
        }
        const secret = await new TextEncoder().encode(
            "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
        );
        const { payload } = await jose.jwtVerify(jwt, secret);
        const body = request.body;
        const schedule = await Schedule.findOne({
            where: {id: body.id},
            include: [Service, Contract]
        })
        console.log(schedule.state);
        if (schedule.state === "REJECT" || schedule.state === "DONE"){
            return(false);
        }
        //VERIFY OWNING
        if (payload.type === 'provider'){
            if (schedule.service.providerId !== payload.id){
                return(false)
            }
        }
        else if (payload.type === 'client'){
            if (schedule.contract.clientId !== payload.id){
                return(false)
            }
        }
        return(true)
    }
    catch (e) {
        return(false)
    }
}

@Injectable()
export class ClientGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return validateClient(request);
    }
}

async function validateClient(request){
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
export class DeleteGuard implements CanActivate {
    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return validateDelete(request);
    }
}

async function validateDelete(request){
    try {
        const jwt = request.headers['authorization'].split(" ")[1];
        if (!jwt) {
            return false;
        }
        const secret = await new TextEncoder().encode(
            "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
        );
        const body = request.body;
        let flag = false;
        console.log("IID", body.id)
        const { payload } = await jose.jwtVerify(jwt, secret);
        if (payload.type === "provider"){
            const services = await Service.findAll({
                where: {providerId: payload.id},
                include: {
                    model: Schedule,
                    attributes: ["id", "serviceId", "contractId", "state", "properties"],
                }
            })
            services.forEach(service => {
                const schedulesId = service.schedules.map(schedule => {return(schedule.id)});
                if (schedulesId.includes(body.id)){
                    flag = true;
                }
            })
        }
        else if (payload.type === "client"){
            const contracts = await Contract.findAll({
                where: {clientId: payload.id},
                include: {
                    model: Schedule,
                    attributes: ["id", "serviceId", "contractId", "state", "properties"],
                }
            })
            contracts.forEach(contract => {
                const contracsId = contract.schedules.map(schedule => {return(schedule.id)})
                if (contracsId.includes(body.id)){
                    flag = true;
                }
            })
        }

        return flag

    }
    catch (e) {
        return false
    }
}