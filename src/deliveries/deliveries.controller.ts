import { Controller, Post, Get, Put, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from "@nestjs/swagger";
import { Body, Headers } from '@nestjs/common';

import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { DeleteDeliveryDto } from './dto/delete-delivery.dto';

import { DeliveriesService } from './deliveries.service';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

@Controller('deliveries')
export class DeliveriesController {
    constructor(private readonly deliveriesService: DeliveriesService) { }

    @Post('create')
    @ApiTags('Deliveries Endpoints')
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({ status: StatusCodes.CREATED, description: ReasonPhrases.CREATED })
    @ApiResponse({ status: StatusCodes.BAD_REQUEST, description: ReasonPhrases.BAD_REQUEST })
    @ApiResponse({ status: StatusCodes.FORBIDDEN, description: ReasonPhrases.FORBIDDEN })
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR })
    create(@Body() deliveryDto: CreateDeliveryDto){
        return this.deliveriesService.create(deliveryDto);
    }

    @Get('/getData')
    @ApiTags('Deliveries Endpoints')
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({ status: StatusCodes.OK, description: ReasonPhrases.OK })
    @ApiResponse({ status: StatusCodes.FORBIDDEN, description: ReasonPhrases.FORBIDDEN })
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR })
    getData(@Headers() headers: Headers){
        return this.deliveriesService.getData(headers)
    }

    @Put('/updateData')
    @ApiTags('Deliveries Endpoints')
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({ status: StatusCodes.OK, description: ReasonPhrases.OK })
    @ApiResponse({ status: StatusCodes.BAD_REQUEST, description: ReasonPhrases.BAD_REQUEST })
    @ApiResponse({ status: StatusCodes.FORBIDDEN, description: ReasonPhrases.FORBIDDEN })
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR })
    updateData(@Body() deliveryDto: UpdateDeliveryDto){
        return this.deliveriesService.updateData(deliveryDto)
    }

    @Delete('/deleteSchedule')
    @ApiTags('Deliveries Endpoints')
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({ status: StatusCodes.GONE, description: ReasonPhrases.GONE })
    @ApiResponse({ status: StatusCodes.BAD_REQUEST, description: ReasonPhrases.BAD_REQUEST })
    @ApiResponse({ status: StatusCodes.FORBIDDEN, description: ReasonPhrases.FORBIDDEN })
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR })
    delete(@Body() deliveryDto:DeleteDeliveryDto){
        return this.deliveriesService.delete(deliveryDto)
    }

}
