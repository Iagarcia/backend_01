import { Controller, Post, Get, Put } from '@nestjs/common';
import { UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Body, Headers, Param, Res  } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiConsumes,  } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';

import { CreateProviderDto } from './dto/create-provider.dto';
import { AuthenticateProviderDto } from "./dto/authenticate-provider.dto";
import { ReauthenticateProviderDto } from "./dto/reauthenticate-provider.dto";
import { RecoverProviderDto } from "./dto/recover-provider.dto";
import { UpdateProviderPersonalDataDto } from "./dto/update-provider-personal-data.dto";
import { UpdateProviderContactDataDto} from "./dto/update-provider-contact-data.dto";
import { UpdatePropertiesDataDto } from "./dto/update-properties-data.dto";
import { UpdateProviderPhotoDto } from "./dto/update-provider-photo.dto";

import { ProvidersService } from './providers.service';
import { AuthGuard, AgainGuard, ClientGuard } from "./providers.guard";
import {of} from "rxjs";

@Controller('/providers')
export class ProvidersController {
    constructor(private readonly providersService: ProvidersService) {}

    @Post()
    @ApiTags('Providers Endpoints')
    create(@Body() createProviderDto: CreateProviderDto){
        return this.providersService.create(createProviderDto);
    }

    @Post('/authenticate')
    @ApiTags('Providers Endpoints')
    authenticate(@Body() authenticateProviderDto: AuthenticateProviderDto) {
        return this.providersService.authenticate(authenticateProviderDto);
    }

    @Post('/reauthenticate')
    @ApiTags('Providers Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AgainGuard)
    reauthenticate(@Body() reauthenticateProviderDto: ReauthenticateProviderDto, @Headers() headers) {
        return this.providersService.reauthenticate(reauthenticateProviderDto, headers);
    }

    @Get('/requestData')
    @ApiTags('Providers Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard)
    requestData(@Headers() headers){
        return this.providersService.requestData(headers);
    }

    @Put('/recover')
    @ApiTags('Providers Endpoints')
    @ApiBearerAuth('JWT-auth')
    recover(@Body() recoverDto: RecoverProviderDto) {
        return this.providersService.recover(recoverDto);
    }

    @Put('/updatePersonalData')
    @ApiTags('Providers Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard)
    updatePersonalData(@Headers() headers, @Body() personalDataDto: UpdateProviderPersonalDataDto) {
        return this.providersService.updatePersonalData(headers, personalDataDto);
    }

    @Put('/updateContactData')
    @ApiTags('Providers Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard)
    updateContactData(@Headers() headers, @Body() contactDataDto: UpdateProviderContactDataDto) {
        return this.providersService.updateContactData(headers, contactDataDto);
    }

    @Put('/updatePropertiesData')
    @ApiTags('Providers Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard)
    updatePropertiesData(@Headers() headers, @Body() updatePropertiesDataDto: UpdatePropertiesDataDto) {
        return this.providersService.updatePropertiesData(headers, updatePropertiesDataDto);
    }

    @Put('/updatePhoto')
    @ApiConsumes('multipart/form-data')
    @ApiTags('Providers Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    updatePhoto(
        @Body() photoDto:UpdateProviderPhotoDto,
        @Headers() headers,
        @UploadedFile() file: Express.Multer.File) {
	console.log("BODY:", photoDto);
	console.log("FILE:", file);
        if(file.mimetype.split('/')[0]==='image'){
            if(file.size < 10000000){
                return this.providersService.updatePhoto(headers, file);
            }
            else {
                return ({
                    error: "El archivo excede tamaño máximo permitido"
                })
            }
        }
        else {
            return ({
                error: "El archivo no es una foto"
            })
        }
    }

    @Get('/getPhoto/:filename')
    @ApiTags('Providers Endpoints')
    getPhoto(@Param('filename') filename: string, @Res() res){
        return of (res.sendFile(join(process.cwd(), './uploads/'+filename)));
    }

    @Get('/getProvider/:id')
    @ApiTags('Providers Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(ClientGuard)
    getProvider(@Param('id') id: number){
        return this.providersService.getProvider(id)
    }
}
