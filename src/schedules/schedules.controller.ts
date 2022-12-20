import {Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Body, Headers } from '@nestjs/common';

import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleStateDto } from "./dto/update-schedule-state.dto";
import { UpdateSchedulePropertiesDto } from "./dto/update-schedule-properties.dto";
import { DeleteScheduleDto } from './dto/delete-schedule.dto';

import { SchedulesService } from './schedules.service';
import { AccessGuard, OwningGuard, StateGuard } from "./schedules.guard";
import { PropertiesGuard, ClientGuard, DeleteGuard } from "./schedules.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller('/schedules')
export class SchedulesController {
    constructor(private readonly schedulesService: SchedulesService) {}

    @Post()
    @ApiTags('Schedules Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AccessGuard)
    @UseGuards(OwningGuard)
    create(@Body() createScheduleDto: CreateScheduleDto){
        return this.schedulesService.create(createScheduleDto);
    }

    @Get('/requestSchedules')
    @ApiTags('Schedules Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AccessGuard)
    requestSchedules(@Headers() headers){
        return this.schedulesService.requestSchedules(headers)
    }

    @Put('/updateScheduleState')
    @ApiTags('Schedules Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AccessGuard)
    @UseGuards(StateGuard)
    updateScheduleState(@Body() stateDto: UpdateScheduleStateDto){
        return this.schedulesService.updateScheduleState(stateDto)
    }

    @Put('/updateScheduleProperties')
    @ApiTags('Schedules Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AccessGuard)
    @UseGuards(PropertiesGuard)
    updateScheduleProperties(@Body() propertiesDto: UpdateSchedulePropertiesDto){
        return this.schedulesService.updateScheduleProperties(propertiesDto)
    }

    @Delete('/deleteSchedule')
    @ApiTags('Schedules Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(DeleteGuard)
    delete(@Body() deleteScheduleDto:DeleteScheduleDto){
        return this.schedulesService.delete(deleteScheduleDto)
    }

    @Get('/requestProvider/:id')
    @ApiTags('Schedules Endpoints')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(ClientGuard)
    requestProvider(@Param('id') id: number){
        return this.schedulesService.requestProvider(id);
    }
}