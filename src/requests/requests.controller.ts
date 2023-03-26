import { Controller, Post, Get, Put, Delete } from '@nestjs/common';
import { UseGuards, UseFilters, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Body, Headers, Param, Res } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiConsumes } from '@nestjs/swagger';

import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { UpdateRequestPhotosDto } from './dto/update-request-photos.dto';
import { DeleteRequestDto } from './dto/delete-request.dto';

import { RequestsService } from './requests.service';
import { HttpExceptionFilter } from './requests.filter';
import { ClientGuard, OwnGuard, AuthGuard } from './requests.guard';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { of } from "rxjs";
import { join } from "path";

@Controller('requests')
export class RequestsController {
    constructor(private readonly requestsService: RequestsService) {}

    @Post('create')
    @UseGuards(ClientGuard)
    @UseFilters(new HttpExceptionFilter())
    @ApiTags('Requests Endpoints')
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({ status: StatusCodes.CREATED, description: ReasonPhrases.CREATED })
    @ApiResponse({ status: StatusCodes.BAD_REQUEST, description: ReasonPhrases.BAD_REQUEST })
    @ApiResponse({ status: StatusCodes.FORBIDDEN, description: ReasonPhrases.FORBIDDEN })
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR })
    
    create(@Body() requestDto: CreateRequestDto,  @Headers() headers: Headers){
        return this.requestsService.create(requestDto, headers);
    }

    @Get('getData')
    @UseGuards(ClientGuard)
    @UseFilters(new HttpExceptionFilter())
    @ApiTags('Requests Endpoints')
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({ status: StatusCodes.OK, description: ReasonPhrases.OK })
    @ApiResponse({ status: StatusCodes.FORBIDDEN, description: ReasonPhrases.FORBIDDEN })
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR })
    getData(@Headers() headers: Headers) {
        return this.requestsService.getData(headers);
    }

    @Put('updateData')
    @UseGuards(OwnGuard)
    @UseFilters(new HttpExceptionFilter())
    @ApiTags('Requests Endpoints')
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({ status: StatusCodes.OK, description: ReasonPhrases.OK })
    @ApiResponse({ status: StatusCodes.BAD_REQUEST, description: ReasonPhrases.BAD_REQUEST })
    @ApiResponse({ status: StatusCodes.FORBIDDEN, description: ReasonPhrases.FORBIDDEN })
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR })
    updateData(@Body() requestDto: UpdateRequestDto) {
        return this.requestsService.updateData(requestDto);
    }

    @Put('/updatePhotos')
    @UseGuards(ClientGuard)
    @ApiConsumes('multipart/form-data')
    @ApiTags('Requests Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseInterceptors(FilesInterceptor('files'))
    updateServicePhotos(@Body() photosDto: UpdateRequestPhotosDto,
                        @Headers() headers,
                        @UploadedFiles() files: Array<Express.Multer.File>){
        return this.requestsService.updatePhotos(photosDto, headers, files)
    }

    @Get('/getPhoto/:filename')
    @ApiTags('Requests Endpoints')
    @ApiResponse({ status: StatusCodes.OK, description: ReasonPhrases.OK })
    @ApiResponse({ status: StatusCodes.BAD_REQUEST, description: ReasonPhrases.BAD_REQUEST })
    @ApiResponse({ status: StatusCodes.FORBIDDEN, description: ReasonPhrases.FORBIDDEN })
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR })
    getPhoto(@Param('filename') filename: string, @Res() res){
        return this.requestsService.getPhoto(res, filename);
    }

    @Delete('/delete')
    @UseGuards(OwnGuard)
    @ApiTags('Requests Endpoints')
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({ status: StatusCodes.GONE, description: ReasonPhrases.GONE })
    @ApiResponse({ status: StatusCodes.BAD_REQUEST, description: ReasonPhrases.BAD_REQUEST })
    @ApiResponse({ status: StatusCodes.FORBIDDEN, description: ReasonPhrases.FORBIDDEN })
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR })
    delete(@Body() deleteServiceDto:DeleteRequestDto){
        return this.requestsService.delete(deleteServiceDto)
    }

}
