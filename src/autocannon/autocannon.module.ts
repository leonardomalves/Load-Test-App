// src/autocannon/autocannon.module.ts
import { Module } from '@nestjs/common';
import { AutocannonService } from './autocannon.service';
import { AutocannonController } from './autocannon.controller';

@Module({
  controllers: [AutocannonController],
  providers: [AutocannonService],
})
export class AutocannonModule {}
