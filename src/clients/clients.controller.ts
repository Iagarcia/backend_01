import { Controller, Post, Get, Put } from '@nestjs/common';
import { UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Body, Headers, Param, Res  } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';

import { CreateClientDto } from './dto/create-client.dto';
import { AuthenticateClientDto } from "./dto/authenticate-client.dto";
import { ReauthenticateClientDto } from "./dto/reauthenticate-client.dto";
import { RecoverClientDto } from "./dto/recover-client.dto";
import { UpdateClientPersonalDataDto } from "./dto/update-client-personal-data.dto";
import { UpdateClientContactDataDto} from "./dto/update-client-contact-data.dto";
import { UpdateClientPropertiesDataDto } from "./dto/update-client-properties-data.dto";
import { UpdateClientPhotoDto} from "./dto/update-client-photo.dto";

import { ClientsService } from './clients.service';
import { AuthGuard, AgainGuard } from "./clients.guard";
import { of } from "rxjs";

@Controller('/clients')
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) {}

    @Post()
    @ApiTags('Clients Endpoints')
    create(@Body() createClientDto: CreateClientDto){
        return this.clientsService.create(createClientDto);
    }

    @Post('/authenticate')
    @ApiTags('Clients Endpoints')
    authenticate(@Body() authenticateClientDto: AuthenticateClientDto) {
        return this.clientsService.authenticate(authenticateClientDto);
    }

    @Post('/reauthenticate')
    @ApiTags('Clients Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AgainGuard)
    reauthenticate(@Body() reauthenticateClientDto: ReauthenticateClientDto, @Headers() headers) {
        return this.clientsService.reauthenticate(reauthenticateClientDto, headers);
    }

    @Get('/requestData')
    @ApiTags('Clients Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard)
    requestData(@Headers() headers){
        return this.clientsService.requestData(headers);
    }

    @Put('/recover')
    @ApiTags('Clients Endpoints')
    @ApiBearerAuth('JWT-auth')
    recover(@Body() recoverDto: RecoverClientDto) {
        return this.clientsService.recover(recoverDto);
    }

    @Put('/updatePersonalData')
    @ApiTags('Clients Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard)
    updatePersonalData(@Headers() headers, @Body() personalDataDto: UpdateClientPersonalDataDto) {
        return this.clientsService.updatePersonalData(headers, personalDataDto);
    }

    @Put('/updateContactData')
    @ApiTags('Clients Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard)
    updateContactData(@Headers() headers, @Body() contactDataDto: UpdateClientContactDataDto) {
        return this.clientsService.updateContactData(headers, contactDataDto);
    }

    @Put('/updatePropertiesData')
    @ApiTags('Clients Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard)
    updatePropertiesData(@Headers() headers, @Body() propertiesDataDto: UpdateClientPropertiesDataDto) {
        return this.clientsService.updatePropertiesData(headers, propertiesDataDto);
    }

    @Put('/updatePhoto')
    @ApiConsumes('multipart/form-data')
    @ApiTags('Clients Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    updatePhoto(
        @Body() photoDto:UpdateClientPhotoDto,
        @Headers() headers,
        @UploadedFile() file: Express.Multer.File) {
        try{
            if(file.mimetype.split('/')[0]==='image'){
                if(file.size < 10000000){
                    return this.clientsService.updatePhoto(headers, file);
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
        catch (error) {
            return(error)
        }
    }

    @Get('/getPhoto/:filename')
    @ApiTags('Clients Endpoints')
    getPhoto(@Param('filename') filename: string, @Res() res){
        return of (res.sendFile(join(process.cwd(), './uploads/'+filename)));
    }
}
