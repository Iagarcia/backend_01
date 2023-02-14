import { Controller, Post, Get, Put, HttpCode, UseFilters } from '@nestjs/common';
import { UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Body, Headers, Param, Res } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreateProviderDto } from './dto/create-provider.dto';
import { AuthenticateProviderDto } from "./dto/authenticate-provider.dto";
import { RecoverProviderDto } from "./dto/recover-provider.dto";
import { UpdateProviderDto } from './dto/update-provider.dto';
import { UpdateProviderPhotoDto } from "./dto/update-provider-photo.dto";

import { ProvidersService } from './providers.service';
import { HttpExceptionFilter } from "./providers.filter";
import { AuthGuard, ProviderGuard } from "./providers.guard";
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

@Controller('/providers')
export class ProvidersController {
    constructor(private readonly providersService: ProvidersService) { }

    @Post('/create')
    @UseFilters(new HttpExceptionFilter())
    @ApiTags('Providers Endpoints')
    @ApiResponse({ status: StatusCodes.CREATED, description: ReasonPhrases.CREATED })
    @ApiResponse({ status: StatusCodes.BAD_REQUEST, description: ReasonPhrases.BAD_REQUEST })
    @ApiResponse({ status: StatusCodes.FORBIDDEN, description: ReasonPhrases.FORBIDDEN })
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR })
    create(@Body() createProviderDto: CreateProviderDto) {
        return this.providersService.create(createProviderDto);
    }

    @Post('/authenticate')
    @HttpCode(200)
    @UseFilters(new HttpExceptionFilter())
    @ApiTags('Providers Endpoints')
    @ApiResponse({ status: StatusCodes.OK, description: ReasonPhrases.OK })
    @ApiResponse({ status: StatusCodes.BAD_REQUEST, description: ReasonPhrases.BAD_REQUEST })
    @ApiResponse({ status: StatusCodes.UNAUTHORIZED, description: ReasonPhrases.UNAUTHORIZED })
    @ApiResponse({ status: StatusCodes.FORBIDDEN, description: ReasonPhrases.FORBIDDEN })
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR })
    authenticate(@Body() authenticateProviderDto: AuthenticateProviderDto) {
        return this.providersService.authenticate(authenticateProviderDto);
    }

    @Put('/recover')
    @UseFilters(new HttpExceptionFilter())
    @ApiTags('Providers Endpoints')
    @ApiResponse({ status: StatusCodes.OK, description: ReasonPhrases.OK })
    @ApiResponse({ status: StatusCodes.BAD_REQUEST, description: ReasonPhrases.BAD_REQUEST })
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR })
    recover(@Body() recoverDto: RecoverProviderDto) {
        return this.providersService.recover(recoverDto);
    }

    @Get('/getData')
    @UseFilters(new HttpExceptionFilter())
    @ApiTags('Providers Endpoints')
    @ApiResponse({ status: StatusCodes.OK, description: ReasonPhrases.OK })
    @ApiResponse({ status: StatusCodes.FORBIDDEN, description: ReasonPhrases.FORBIDDEN })
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard)
    getData(@Headers() headers: Headers) {
        return this.providersService.getData(headers);
    }

    @Put('update')
    @UseFilters(new HttpExceptionFilter())
    @ApiTags('Providers Endpoints')
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({ status: StatusCodes.OK, description: ReasonPhrases.OK })
    @ApiResponse({ status: StatusCodes.FORBIDDEN, description: ReasonPhrases.FORBIDDEN })
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR })
    update(@Headers() headers: Headers, @Body() accountDto: UpdateProviderDto) {
        return this.providersService.update(headers, accountDto);
    }

    @Put('/updatePhoto')
    @UseFilters(new HttpExceptionFilter())
    @ApiConsumes('multipart/form-data')
    @ApiTags('Providers Endpoints')
    @ApiResponse({ status: StatusCodes.OK, description: ReasonPhrases.OK })
    @ApiResponse({ status: StatusCodes.BAD_REQUEST, description: ReasonPhrases.BAD_REQUEST })
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(ProviderGuard)
    @UseInterceptors(FileInterceptor('file'))
    updatePhoto(
        @Body() _photoDto: UpdateProviderPhotoDto,
        @Headers() headers,
        @UploadedFile() file: Express.Multer.File) {
        return this.providersService.updatePhoto(headers, file);
    }

    @Get('/getPhoto/:filename')
    @UseFilters(new HttpExceptionFilter())
    @ApiTags('Providers Endpoints')
    @ApiResponse({ status: StatusCodes.OK, description: ReasonPhrases.OK })
    @ApiResponse({ status: StatusCodes.NOT_FOUND, description: ReasonPhrases.NOT_FOUND })
    getPhoto(@Param('filename') filename: string, @Res() res: any) {
        return this.providersService.getPhoto(res, filename);
    }
}