// src/requests/requests.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs/promises';

@Injectable()
export class RequestsService {
  async sendRequests(
    totalRequests: number,
    url: string,
    headers: Record<string, string>,
    payload: any
  ): Promise<{ totalSuccess: number; totalFailures: number; totalTime: string; averageTime: string; totalTimePerRequest: string }> {
    const start = Date.now();
    let totalSuccess = 0;
    let totalFailures = 0;
    let totalResponseTime = 0;

    const logData: string[] = [];

    try {
      await Promise.all(
        Array.from({ length: totalRequests }, async () => {
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
            const requestHeaders = JSON.stringify(headers); // Cabeçalhos serializados para string

            logData.push(`${url};${requestStartTime};${requestEndTime};${formattedResponseTime};${formattedLatency};${response.status}`);
          } catch (error) {
            totalFailures++;

            const requestEndTime = new Date().toISOString();
            const formattedResponseTime = '0ms';
            const formattedLatency = '0ms';
            const requestHeaders = JSON.stringify(headers); // Cabeçalhos serializados para string

            logData.push(`${url};${requestStartTime};${requestEndTime};${formattedResponseTime};${formattedLatency};${error.response?.status || 'Error'}`);
          }
        })
      );

      const end = Date.now();
      const totalTime = end - start;
      const averageTime = totalSuccess > 0 ? totalResponseTime / totalSuccess : 0;
      const totalTimePerRequest = totalSuccess + totalFailures > 0 ? totalTime / (totalSuccess + totalFailures) : 0;

      await this.writeLogToFile(logData); // Escrever o log no arquivo

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

    // Incluir cabeçalhos no arquivo de log
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
}
