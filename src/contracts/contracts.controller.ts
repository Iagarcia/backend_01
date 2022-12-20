import { Controller, Delete, Get, Param, Post, Put, Res, UploadedFiles, UseInterceptors} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Body, Headers } from '@nestjs/common';

import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractGeneralDataDto } from "./dto/update-contract-general-data.dto";
import { UpdateContractPurchaseDataDto } from "./dto/update-contract-purchase-data.dto";
import { UpdateContractPropertiesDto } from "./dto/update-contract-properties.dto";
import { UpdateContractPhotosDto } from "./dto/update-contract-photos.dto";
import { DeleteContractDto } from "./dto/delete-contract.dto";

import { ContractsService } from './contracts.service';
import { AccessGuard, OwningGuard, ProviderGuard } from "./contracts.guard";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FilesInterceptor } from "@nestjs/platform-express";
import { of } from "rxjs";
import { join } from "path";

@Controller('/contracts')
export class ContractsController {
    constructor(private readonly contractsService: ContractsService) {}

    @Post()
    @ApiTags('Contracts Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AccessGuard)
    create(@Body() createContractDto: CreateContractDto, @Headers() headers) {
        return this.contractsService.create(createContractDto, headers);
    }

    @Get('/requestContracts')
    @ApiTags('Contracts Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AccessGuard)
    requestServices(@Headers() headers){
        return this.contractsService.requestContracts(headers)
    }

    @Put('/updateGeneralData')
    @ApiTags('Contracts Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AccessGuard)
    @UseGuards(OwningGuard)
    updateGeneralData(@Body() generalDataDto:UpdateContractGeneralDataDto){
        return this.contractsService.updateGeneralData(generalDataDto)
    }

    @Put('/updatePurchaseData')
    @ApiTags('Contracts Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AccessGuard)
    @UseGuards(OwningGuard)
    updatePurchaseData(@Body() purchaseDataDto:UpdateContractPurchaseDataDto){
        return this.contractsService.updatePurchaseData(purchaseDataDto)
    }

    @Put('/updateContractProperties')
    @ApiTags('Contracts Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AccessGuard)
    @UseGuards(OwningGuard)
    updateContractProperties(@Body() propertiesDto:UpdateContractPropertiesDto){
        return this.contractsService.updateContractProperties(propertiesDto)
    }

    @Put('/updateContractPhotos')
    @ApiConsumes('multipart/form-data')
    @ApiTags('Contracts Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseInterceptors(FilesInterceptor('files'))
    @UseGuards(AccessGuard)
    updateContractPhotos(@Body() photosDto:UpdateContractPhotosDto,
                         @Headers() headers,
                         @UploadedFiles() files: Array<Express.Multer.File>){
        return this.contractsService.updateContractPhotos(photosDto, headers, files)
    }

    @Get('/getPhoto/:filename')
    @ApiTags('Contracts Endpoints')
    getPhoto(@Param('filename') filename: string, @Res() res){
        return of (res.sendFile(join(process.cwd(), './uploads/'+filename)));
    }

    @Get('/getContract/:id')
    @ApiTags('Contracts Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(ProviderGuard)
    getService(@Param('id') id: number){
        return this.contractsService.getContract(id);
    }

    @Delete('/deleteService')
    @ApiTags('Contracts Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AccessGuard)
    @UseGuards(OwningGuard)
    delete(@Body() deleteContractDto:DeleteContractDto){
        return this.contractsService.delete(deleteContractDto)
    }
}
