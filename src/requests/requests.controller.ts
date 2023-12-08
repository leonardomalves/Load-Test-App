// src/requests/requests.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { RequestsService } from './requests.service';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {
  }

  @Post()
  async sendRequests(@Body() requestBody: {
    url: string;
    headers: Record<string, string>;
    payload: any,
    totalRequest: number,
    delayBetweenRequests: number,
    batchSize: number,
  }): Promise<{
    totalSuccess: number;
    totalFailures: number;
    totalTimeSeconds: number;
    averageTimeSeconds: number;
    totalTimePerRequestSeconds: number
  }> {
    const {
      totalSuccess,
      totalFailures,
      totalTime,
      averageTime,
      totalTimePerRequest
    } = await this.requestsService.sendRequestsInBatches(
      requestBody.totalRequest,
      requestBody.batchSize,
      requestBody.url,
      requestBody.headers,
      requestBody.payload,
      requestBody.delayBetweenRequests
    );

    // @ts-ignore
    const totalTimeSeconds: number = totalTime !== undefined ? totalTime / 1000 : 0; // Tempo total em segundos
    // @ts-ignore
    const averageTimeSeconds: number = averageTime !== undefined ? averageTime / 1000 : 0; // Tempo médio em segundos
    // @ts-ignore
    const totalTimePerRequestSeconds: number = totalTimePerRequest !== undefined ? totalTimePerRequest / 1000 : 0; // Tempo total por requisição em segundos

    console.log('Total Success:', totalSuccess);
    console.log('Total Failures:', totalFailures);
    console.log('Total Time (seconds):', totalTimeSeconds);
    console.log('Average Time (seconds):', averageTimeSeconds);
    console.log('Total Time Per Request (seconds):', totalTimePerRequestSeconds);

    return { totalSuccess, totalFailures, totalTimeSeconds, averageTimeSeconds, totalTimePerRequestSeconds };
  }
}
