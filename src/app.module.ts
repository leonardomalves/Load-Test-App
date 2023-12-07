import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestsController } from "./requests/requests.controller";
import { RequestsService } from "./requests/requests.service";

@Module({
  imports: [],
  controllers: [AppController, RequestsController],
  providers: [AppService, RequestsService],
})
export class AppModule {}
