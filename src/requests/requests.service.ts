// src/requests/requests.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs/promises';

@Injectable()
export class RequestsService {
  async sendRequestsSequentially(
    totalRequests: number,
    url: string,
    headers: Record<string, string>,
    payload: any,
    delayBetweenRequests: number = 1000
  ): Promise<{
    totalSuccess: number;
    totalFailures: number;
    totalTime: string;
    averageTime: string;
    totalTimePerRequest: string
  }> {
    const start = Date.now();
    let totalSuccess = 0;
    let totalFailures = 0;
    let totalResponseTime = 0;

    const logData: string[] = [];

    try {
      for (let i = 0; i < totalRequests; i++) {
        const requestStartTime = new Date().toISOString();
        const responseTimeStart = Date.now();

        try {
          const response = await axios.post(url, payload, { headers });
          const responseTimeEnd = Date.now();
          const responseTime = responseTimeEnd - responseTimeStart;

          totalSuccess++;
          totalResponseTime += responseTime;

          const requestEndTime = new Date().toISOString();
          const formattedResponseTime = this.formatMilliseconds(responseTime);
          const formattedLatency = this.formatMilliseconds(responseTime);

          logData.push(`${url};${requestStartTime};${requestEndTime};${formattedResponseTime};${formattedLatency};${response.status}`);
          console.log(`${url} - ${requestStartTime} - ${requestEndTime} - ${formattedResponseTime} - ${formattedLatency} - ${response.status}`);

        } catch (error) {
          totalFailures++;

          const requestEndTime = new Date().toISOString();
          const formattedResponseTime = '0ms';
          const formattedLatency = '0ms';
          logData.push(`${url};${requestStartTime};${requestEndTime};${formattedResponseTime};${formattedLatency};${error.response?.status || 'Error'}`);

        }

        await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
      }

      const end = Date.now();
      const totalTime = end - start;
      const averageTime = totalSuccess > 0 ? totalResponseTime / totalSuccess : 0;
      const totalTimePerRequest = totalSuccess + totalFailures > 0 ? totalTime / (totalSuccess + totalFailures) : 0;

      await this.writeLogToFile(logData);

      return {
        totalSuccess,
        totalFailures,
        totalTime: this.formatMilliseconds(totalTime),
        averageTime: this.formatMilliseconds(averageTime),
        totalTimePerRequest: this.formatMilliseconds(totalTimePerRequest),
      };
    } catch (error) {
      throw new Error(`Request error ${totalRequests}: ${error.message}`);
    }
  }


  private async writeLogToFile(logData: string[]): Promise<void> {
    const logFileName = 'request_log.csv';
    const headers = 'URL;Start Time;End Time;Response Time;Latency;Status Code\n';

    try {
      await fs.writeFile(logFileName, headers + logData.join('\n') + '\n', 'utf-8');
    } catch (error) {
      console.error('Error writing log to file:', error.message);
    }
  }

  private formatMilliseconds(milliseconds: number): string {
    if (milliseconds < 1000) {
      return `${milliseconds}ms`;
    } else {
      const seconds = milliseconds / 1000;
      return `${seconds.toFixed(2)}s`;
    }
  }

  async sendRequestsInBatches(
    totalRequests: number,
    batchSize: number,
    url: string,
    headers: Record<string, string>,
    payload: any,
    delayBetweenBatches: number = 1000
  ): Promise<{
    totalSuccess: number;
    totalFailures: number;
    totalTime: string;
    averageTime: string;
    totalTimePerRequest: string
  }> {
    const start = Date.now();
    let totalSuccess = 0;
    let totalFailures = 0;
    let totalResponseTime = 0;

    const logData: string[] = [];

    try {
      const batches = Math.ceil(totalRequests / batchSize);

      for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
        const batchStart = batchIndex * batchSize;
        const batchEnd = Math.min((batchIndex + 1) * batchSize, totalRequests);

        const batchPromises = [];

        for (let i = batchStart; i < batchEnd; i++) {
          const requestStartTime = new Date().toISOString();

          const requestPromise = (async () => {
            const responseTimeStart = Date.now();

            try {
              const response = await axios.post(url, payload, { headers });
              const responseTimeEnd = Date.now();
              const responseTime = responseTimeEnd - responseTimeStart;

              totalSuccess++;
              totalResponseTime += responseTime;

              const requestEndTime = new Date().toISOString();
              const formattedResponseTime = this.formatMilliseconds(responseTime);
              const formattedLatency = this.formatMilliseconds(responseTime);

              logData.push(`${url};${requestStartTime};${requestEndTime};${formattedResponseTime};${formattedLatency};${response.status}`);
            } catch (error) {
              totalFailures++;

              const requestEndTime = new Date().toISOString();
              const formattedResponseTime = '0ms';
              const formattedLatency = '0ms';
              logData.push(`${url};${requestStartTime};${requestEndTime};${formattedResponseTime};${formattedLatency};${error.response?.status || 'Error'}`);
            }
          })();

          batchPromises.push(requestPromise);
        }

        // Aguarda o envio de todo o lote antes de prosseguir para o próximo lote
        await Promise.all(batchPromises);

        // Introduz um atraso curto entre os lotes
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }

      const end = Date.now();
      const totalTime = end - start;
      const averageTime = totalSuccess > 0 ? totalResponseTime / totalSuccess : 0;
      const totalTimePerRequest = totalSuccess + totalFailures > 0 ? totalTime / (totalSuccess + totalFailures) : 0;

      await this.writeLogToFile(logData);

      return {
        totalSuccess,
        totalFailures,
        totalTime: this.formatMilliseconds(totalTime),
        averageTime: this.formatMilliseconds(averageTime),
        totalTimePerRequest: this.formatMilliseconds(totalTimePerRequest),
      };
    } catch (error) {
      throw new Error(`Request error ${totalRequests}: ${error.message}`);
    }
  }

}
