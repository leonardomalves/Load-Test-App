import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestsController } from "./requests/requests.controller";
import { RequestsService } from "./requests/requests.service";
import { AutocannonController } from "./autocannon/autocannon.controller";
import { AutocannonService } from "./autocannon/autocannon.service";

@Module({
  imports: [],
  controllers: [AppController, RequestsController, AutocannonController],
  providers: [AppService, RequestsService, AutocannonService],
})
export class AppModule {}
