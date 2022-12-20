import { Controller, Post, Get, Put, Delete, Param, Res } from '@nestjs/common';
import { UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { Body, Headers } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceGeneralDataDto } from "./dto/update-service-general-data.dto";
import { UpdateServicePaymentDataDto } from "./dto/update-service-payment-data.dto";
import { UpdateServicePropertiesDto } from "./dto/update-service-properties.dto";
import { UpdateServicePhotosDto } from "./dto/update-service-photos.dto";
import { DeleteServiceDto } from "./dto/delete-service.dto";
import { FilterServiceDto } from "./dto/filter-service.dto";

import { ServicesService } from './services.service';
import { AccessGuard, OwningGuard, ClientGuard } from "./services.guard";
import { ApiTags, ApiBearerAuth, ApiConsumes } from "@nestjs/swagger";
import { of } from "rxjs";
import { join } from "path";

@Controller('/services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) {}

    @Post()
    @ApiTags('Services Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AccessGuard)
    create(@Body() createServiceDto: CreateServiceDto, @Headers() headers){
        return this.servicesService.create(createServiceDto, headers);
    }

    @Get('/requestServices')
    @ApiTags('Services Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AccessGuard)
    requestServices(@Headers() headers){
        return this.servicesService.requestServices(headers)
    }

    @Put('/updateGeneralData')
    @ApiTags('Services Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AccessGuard)
    @UseGuards(OwningGuard)
    updateGeneralData(@Body() generalDataDto:UpdateServiceGeneralDataDto){
        return this.servicesService.updateGeneralData(generalDataDto)
    }

    @Put('/updatePaymentData')
    @ApiTags('Services Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AccessGuard)
    @UseGuards(OwningGuard)
    updatePaymentData(@Body() paymentDataDto:UpdateServicePaymentDataDto){
        return this.servicesService.updatePaymentData(paymentDataDto)
    }

    @Put('/updateServiceProperties')
    @ApiTags('Services Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AccessGuard)
    @UseGuards(OwningGuard)
    updateServiceProperties(@Body() propertiesDto:UpdateServicePropertiesDto){
        return this.servicesService.updateServiceProperties(propertiesDto)
    }

    @Put('/updateServicePhotos')
    @ApiConsumes('multipart/form-data')
    @ApiTags('Services Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseInterceptors(FilesInterceptor('files'))
    @UseGuards(AccessGuard)
    //@UseGuards(OwningGuard)
    updateServicePhotos(@Body() photosDto:UpdateServicePhotosDto,
                        @Headers() headers,
                        @UploadedFiles() files: Array<Express.Multer.File>){
				console.log("BODY", photosDto);
				console.log("HEADERS", headers);
				console.log("FILES", files);
        return this.servicesService.updateServicePhotos(photosDto, headers, files)
    }

    @Get('/getPhoto/:filename')
    @ApiTags('Services Endpoints')
    getPhoto(@Param('filename') filename: string, @Res() res){
        return of (res.sendFile(join(process.cwd(), './uploads/'+filename)));
    }

    @Get('/getService/:id')
    @ApiTags('Services Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(ClientGuard)
    getService(@Param('id') id: number){
        return this.servicesService.getService(id);
    }

    @Delete('/deleteService')
    @ApiTags('Services Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AccessGuard)
    @UseGuards(OwningGuard)
    delete(@Body() deleteServiceDto:DeleteServiceDto){
        return this.servicesService.delete(deleteServiceDto)
    }

    @Post('/filterServices')
    @ApiTags('Services Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(ClientGuard)
    filter(@Body() filterServiceDto:FilterServiceDto){
        return this.servicesService.filter(filterServiceDto)
    }
}
