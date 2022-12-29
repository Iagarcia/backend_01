import { Controller, Post, Get, Put, HttpCode, UseFilters } from '@nestjs/common';
import { UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Body, Headers, Param, Res  } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';

import { CreateClientDto } from './dto/create-client.dto';
import { AuthenticateClientDto } from "./dto/authenticate-client.dto";
import { RecoverClientDto } from "./dto/recover-client.dto";
import { UpdateClientPersonalDataDto } from "./dto/update-personal-data.dto";
import { UpdateClientContactDataDto} from "./dto/update-contact-data.dto";
import { UpdateClientPropertiesDataDto } from "./dto/update-properties.dto";
import { UpdateClientPhotoDto} from "./dto/update-photo.dto";

import { ClientsService } from './clients.service';
import { HttpExceptionFilter } from './clients.filter';
import { AuthGuard } from "./clients.guard";
import { ReasonPhrases, StatusCodes }from 'http-status-codes';
import { of } from "rxjs";

@Controller('/clients')
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) {}

    @Post('/create')
    @UseFilters(new HttpExceptionFilter())
    @ApiTags('Clients Endpoints')
    @ApiResponse({ status: StatusCodes.CREATED, description: ReasonPhrases.CREATED})
    @ApiResponse({ status: StatusCodes.BAD_REQUEST, description: ReasonPhrases.BAD_REQUEST})
    @ApiResponse({ status: StatusCodes.FORBIDDEN, description: ReasonPhrases.FORBIDDEN})
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR})
    create(@Body() createClientDto: CreateClientDto){
        return this.clientsService.create(createClientDto);
    }

    @Post('/authenticate')
    @HttpCode(200)
    @UseFilters(new HttpExceptionFilter())
    @ApiTags('Clients Endpoints')
    @ApiResponse({ status: StatusCodes.OK, description: ReasonPhrases.OK})
    @ApiResponse({ status: StatusCodes.BAD_REQUEST, description: ReasonPhrases.BAD_REQUEST})
    @ApiResponse({ status: StatusCodes.UNAUTHORIZED, description: ReasonPhrases.UNAUTHORIZED})
    @ApiResponse({ status: StatusCodes.FORBIDDEN, description: ReasonPhrases.FORBIDDEN})
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR})
    authenticate(@Body() authenticateClientDto: AuthenticateClientDto) {
        return this.clientsService.authenticate(authenticateClientDto);
    }

    @Put('/recover')
    @UseFilters(new HttpExceptionFilter())
    @ApiTags('Clients Endpoints')
    @ApiTags('Providers Endpoints')
    @ApiResponse({ status: StatusCodes.OK, description: ReasonPhrases.OK})
    @ApiResponse({ status: StatusCodes.BAD_REQUEST, description: ReasonPhrases.BAD_REQUEST})
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR})
    recover(@Body() recoverDto: RecoverClientDto) {
        return this.clientsService.recover(recoverDto);
    }

    @Get('/requestData')
    @UseFilters(new HttpExceptionFilter())
    @ApiTags('Clients Endpoints')
    @ApiResponse({ status: StatusCodes.OK, description: ReasonPhrases.OK})
    @ApiResponse({ status: StatusCodes.FORBIDDEN, description: ReasonPhrases.FORBIDDEN})
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR})
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard)
    requestData(@Headers() headers){
        return this.clientsService.requestData(headers);
    }

    @Put('/updatePersonalData')
    @UseFilters(new HttpExceptionFilter())
    @ApiTags('Clients Endpoints')
    @ApiResponse({ status: StatusCodes.OK, description: ReasonPhrases.OK})
    @ApiResponse({ status: StatusCodes.FORBIDDEN, description: ReasonPhrases.FORBIDDEN})
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR})
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard)
    updatePersonalData(@Headers() headers, @Body() personalDataDto: UpdateClientPersonalDataDto) {
        return this.clientsService.updatePersonalData(headers, personalDataDto);
    }

    @Put('/updateContactData')
    @UseFilters(new HttpExceptionFilter())
    @ApiTags('Clients Endpoints')
    @ApiResponse({ status: StatusCodes.OK, description: ReasonPhrases.OK})
    @ApiResponse({ status: StatusCodes.FORBIDDEN, description: ReasonPhrases.FORBIDDEN})
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR})
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard)
    updateContactData(@Headers() headers, @Body() contactDataDto: UpdateClientContactDataDto) {
        return this.clientsService.updateContactData(headers, contactDataDto);
    }

    @Put('/updatePropertiesData')
    @UseFilters(new HttpExceptionFilter())
    @ApiTags('Clients Endpoints')
    @ApiResponse({ status: StatusCodes.OK, description: ReasonPhrases.OK})
    @ApiResponse({ status: StatusCodes.FORBIDDEN, description: ReasonPhrases.FORBIDDEN})
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR})
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard)
    updatePropertiesData(@Headers() headers, @Body() propertiesDataDto: UpdateClientPropertiesDataDto) {
        return this.clientsService.updatePropertiesData(headers, propertiesDataDto);
    }

    @Put('/updatePhoto')
    @UseFilters(new HttpExceptionFilter())
    @ApiConsumes('multipart/form-data')
    @ApiTags('Clients Endpoints')
    @ApiResponse({ status: StatusCodes.OK, description: ReasonPhrases.OK})
    @ApiResponse({ status: StatusCodes.BAD_REQUEST, description: ReasonPhrases.BAD_REQUEST})
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR})
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    updatePhoto(
        @Body() _photoDto:UpdateClientPhotoDto,
        @Headers() headers,
        @UploadedFile() file: Express.Multer.File) {
            return this.clientsService.updatePhoto(headers, file);
    }

    @Get('/getPhoto/:filename')
    @UseFilters(new HttpExceptionFilter())
    @ApiTags('Clients Endpoints')
    @ApiResponse({ status: StatusCodes.OK, description: ReasonPhrases.OK})
    @ApiResponse({ status: StatusCodes.NOT_FOUND, description: ReasonPhrases.NOT_FOUND})
    getPhoto(@Param('filename') filename: string, @Res() res){
        return this.clientsService.getPhoto(res, filename);
    }
}
