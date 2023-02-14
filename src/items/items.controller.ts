import { Controller, Post, Get, Put, Delete } from '@nestjs/common';
import { UseGuards, UseFilters, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Body, Headers, Param, Res } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiConsumes } from '@nestjs/swagger';

import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { UpdateItemPhotosDto } from './dto/update-item-photos.dto';
import { DeleteItemDto } from './dto/delete-item.dto';

import { ItemsService } from './items.service';
import { HttpExceptionFilter } from "./items.filter";
import { AuthGuard, OwnGuard, ProviderGuard } from './items.guard';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { of } from "rxjs";
import { join } from "path";

@Controller('items')
export class ItemsController {
    constructor(private readonly itemService: ItemsService) {}

    @Post('create')
    @UseGuards(ProviderGuard)
    @UseFilters(new HttpExceptionFilter())
    @ApiTags('Items Endpoints')
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({ status: StatusCodes.CREATED, description: ReasonPhrases.CREATED })
    @ApiResponse({ status: StatusCodes.BAD_REQUEST, description: ReasonPhrases.BAD_REQUEST })
    @ApiResponse({ status: StatusCodes.FORBIDDEN, description: ReasonPhrases.FORBIDDEN })
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR })
    create(@Body() itemDto: CreateItemDto, @Headers() headers: Headers) {
        console.log(itemDto);
        return this.itemService.create(itemDto, headers)
    }

    @Get('getData')
    @UseGuards(ProviderGuard)
    @UseFilters(new HttpExceptionFilter())
    @ApiTags('Items Endpoints')
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({ status: StatusCodes.OK, description: ReasonPhrases.OK })
    @ApiResponse({ status: StatusCodes.FORBIDDEN, description: ReasonPhrases.FORBIDDEN })
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR })
    getData(@Headers() headers: Headers) {
        return this.itemService.getData(headers);
    }

    @Put('updateData')
    @UseGuards(OwnGuard)
    @UseFilters(new HttpExceptionFilter())
    @ApiTags('Items Endpoints')
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({ status: StatusCodes.OK, description: ReasonPhrases.OK })
    @ApiResponse({ status: StatusCodes.BAD_REQUEST, description: ReasonPhrases.BAD_REQUEST })
    @ApiResponse({ status: StatusCodes.FORBIDDEN, description: ReasonPhrases.FORBIDDEN })
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR })
    updateData(@Body() itemDto: UpdateItemDto) {
        return this.itemService.updateData(itemDto);
    }

    @Put('/updateServicePhotos')
    @ApiConsumes('multipart/form-data')
    @ApiTags('Items Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseInterceptors(FilesInterceptor('files'))
    @UseGuards(ProviderGuard)
    updateServicePhotos(@Body() photosDto: UpdateItemPhotosDto,
                        @Headers() headers,
                        @UploadedFiles() files: Array<Express.Multer.File>){
				console.log("BODY", photosDto);
				console.log("HEADERS", headers);
				console.log("FILES", files);
        return this.itemService.updatePhotos(photosDto, headers, files)
    }

    @Get('/getPhoto/:filename')
    @UseGuards(AuthGuard)
    @ApiTags('Items Endpoints')
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({ status: StatusCodes.OK, description: ReasonPhrases.OK })
    @ApiResponse({ status: StatusCodes.BAD_REQUEST, description: ReasonPhrases.BAD_REQUEST })
    @ApiResponse({ status: StatusCodes.FORBIDDEN, description: ReasonPhrases.FORBIDDEN })
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR })
    getPhoto(@Param('filename') filename: string, @Res() res){
        return of (res.sendFile(join(process.cwd(), './uploads/'+filename)));
    }

    @Delete('/deleteService')
    @ApiTags('Items Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(OwnGuard)
    delete(@Body() deleteServiceDto:DeleteItemDto){
        return this.itemService.delete(deleteServiceDto)
    }

}
