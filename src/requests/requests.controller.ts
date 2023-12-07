// src/requests/requests.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { RequestsService } from './requests.service';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  async sendRequests(@Body() requestBody: { url: string; headers: Record<string, string>; payload: any }): Promise<{ totalSuccess: number; totalFailures: number; totalTimeSeconds: number; averageTimeSeconds: number; totalTimePerRequestSeconds: number }> {
    const { totalSuccess, totalFailures, totalTime, averageTime, totalTimePerRequest } = await this.requestsService.sendRequests(
      15,
      requestBody.url,
      requestBody.headers,
      requestBody.payload
    );

    // @ts-ignore
    const totalTimeSeconds: number = totalTime !== undefined ? totalTime / 1000 : 0; // Tempo total em segundos
    // @ts-ignore
    const averageTimeSeconds: number = averageTime !== undefined ? averageTime / 1000 : 0; // Tempo médio em segundos
    // @ts-ignore
    const totalTimePerRequestSeconds: number = totalTimePerRequest !== undefined ? totalTimePerRequest / 1000 : 0; // Tempo total por requisição em segundos

    // Log das métricas ou manipulação conforme necessário
    console.log('Total Success:', totalSuccess);
    console.log('Total Failures:', totalFailures);
    console.log('Total Time (seconds):', totalTimeSeconds);
    console.log('Average Time (seconds):', averageTimeSeconds);
    console.log('Total Time Per Request (seconds):', totalTimePerRequestSeconds);

    return { totalSuccess, totalFailures, totalTimeSeconds, averageTimeSeconds, totalTimePerRequestSeconds };
  }
}
