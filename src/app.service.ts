import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return ({
      message: 'Backend 01: Delivering Goods and Services API!',
      status: true,
    })
  }
}
