// src/autocannon/autocannon.service.ts
import { Injectable } from '@nestjs/common';
import * as autocannon from 'autocannon';

@Injectable()
export class AutocannonService {
  async runTest(url: string, headers: Record<string, string>, payload: any, connections = 15, duration = 5, method: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const instance = autocannon({
        url,
        method: method || 'POST',
        body: JSON.stringify(payload),
        headers,
        connections: connections,
        duration: duration,
      }, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });

      process.once('SIGINT', () => {
        instance.stop();
      });
    });
  }
}
