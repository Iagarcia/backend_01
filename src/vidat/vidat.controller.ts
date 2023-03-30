import { Controller, Post, UseGuards, Body, UseFilters, Put, Get, Param, Headers } from '@nestjs/common';
import { VidatService } from './vidat.service';

import { FilterItemDto } from './dto/filter-item.dto';
import { UpdateDeliveryStateDto } from './dto/update-delivery-state.dto';
import { RetriveAccountDto } from './dto/retrieve-account.dto';

import { ApiTags, ApiBearerAuth, ApiResponse } from "@nestjs/swagger";
import { HttpExceptionFilter } from './vidat.filter';
import { ClientGuard, StateGuard, AgainGuard } from './vidat.guard';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

@Controller('vidat')
export class VidatController {
    constructor(private readonly vidatService: VidatService) {}

    @Post('filterItems')
    @UseFilters(new HttpExceptionFilter())
    @ApiTags('Vidat Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(ClientGuard)
    @ApiResponse({ status: StatusCodes.CREATED, description: ReasonPhrases.CREATED })
    @ApiResponse({ status: StatusCodes.BAD_REQUEST, description: ReasonPhrases.BAD_REQUEST })
    @ApiResponse({ status: StatusCodes.FORBIDDEN, description: ReasonPhrases.FORBIDDEN })
    @ApiResponse({ status: StatusCodes.INTERNAL_SERVER_ERROR, description: ReasonPhrases.INTERNAL_SERVER_ERROR })
    filter(@Body() filter:FilterItemDto){
        return this.vidatService.filterProperties(filter)
    }

    @Put('/updateState')
    @ApiTags('Vidat Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(StateGuard)
    updateScheduleState(@Body() delivery: UpdateDeliveryStateDto){
        return this.vidatService.updateDeliveryState(delivery)
    }

    @Post('/retrieveAccount')
    @ApiTags('Vidat Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AgainGuard)
    reauthenticate(@Body() reauthenticateProviderDto: RetriveAccountDto) {
        return this.vidatService.retrieveAccount(reauthenticateProviderDto);
    }

    @Get('/getItem/:id')
    @ApiTags('Vidat Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(ClientGuard)
    getService(@Param('id') id: number){
        return this.vidatService.getItem(id);
    }


    @Get('/requestProvider/:id')
    @ApiTags('Vidat Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(ClientGuard)
    requestProvider(@Param('id') id: number){
        return this.vidatService.requestProvider(id);
    }

    @Get('/getCalendar/:date')
    @ApiTags('Vidat Endpoints')
    @ApiBearerAuth('JWT-auth')
    getCalendar(@Headers() headers: Headers, @Param('date') date: string) {
        return this.vidatService.getCalendar(headers, date)
    }

    @Get('/getWall')
    @ApiTags('Vidat Endpoints')
    @ApiBearerAuth('JWT-auth')
    getWall(@Headers() headers: Headers) {
        return this.vidatService.getWall(headers)
    }

}
