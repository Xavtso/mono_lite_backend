import { Controller, Get, Sse } from '@nestjs/common';
import { AppService } from './app.service';


@Controller('/')
export class AppController {
  constructor(private appService: AppService) {}

  @Get('')
  getMessage() {
    return this.appService.getUser()
  }
}
