// src/autocannon/controllers/autocannon.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AutocannonService } from './autocannon.service';
import * as fs from 'fs/promises';

@Controller('autocannon')
export class AutocannonController {
  constructor(private readonly autocannonService: AutocannonService) {
  }

  @Post()
  async runTest(@Body() requestBody: {
    connections: number;
    url: string;
    headers: Record<string, string>;
    payload: any,
    duration: number,
    method: string,
  }): Promise<any> {
    try {
      const result = await this.autocannonService.runTest(requestBody.url, requestBody.headers, requestBody.payload, requestBody.connections, requestBody.duration, requestBody.method);
      this.displayFormattedResults(result);
      await this.generateReport(result);
      return result;
    } catch (error) {
      console.error('Erro ao executar o teste Autocannon:', error.message);
      throw new Error('Falha ao executar o teste Autocannon');
    }
  }

  private async generateReport(results: any): Promise<void> {
    const reportFileName = 'autocannon_report.json';

    try {
      const reportData = {
        url: results.url,
        connections: results.connections,
        duration: results.duration.toFixed(2),
        requests: {
          total: results.requests.total,
          average: results.requests.average.toFixed(2),
          min: results.requests.min,
          max: results.requests.max,
        },
        throughput: {
          mean: results.throughput.mean.toFixed(2),
          min: results.throughput.min,
          max: results.throughput.max,
        },
        statusCodeStats: results.statusCodeStats,
        errors: results.errors,
        timeouts: results.timeouts,
        non2xx: results.non2xx,
        latency: {
          average: results.latency.average.toFixed(2),
          min: results.latency.min,
          max: results.latency.max,
        },
      };

      await fs.writeFile(reportFileName, JSON.stringify(reportData, null, 2), 'utf-8');
      console.log(`Relatório principal gerado com sucesso: ${reportFileName}`);
      await this.generateTxtReport(results);
    } catch (error) {
      console.error('Erro ao gerar o relatório principal:', error.message);
    }
  }

  private displayFormattedResults(results: any): void {
    console.log('\nResultados Formatados:');
    console.log(`URL: ${results.url}`);
    console.log(`Conexões: ${results.connections}`);
    console.log(`Duração: ${results.duration.toFixed(2)} segundos`);
    console.log(`Total de Requisições: ${results.requests.total}`);
    console.log(`Taxa de Requisições (por segundo): ${results.throughput.mean.toFixed(2)}`);

    console.log('\nCódigos de Status HTTP:');
    Object.entries(results.statusCodeStats).forEach(([ code, stat ]) => {
      // @ts-ignore
      console.log(`  - ${code} (${stat.count} requisições)`);
    });

    console.log(`\nErros: ${results.errors}`);
    console.log(`Timeouts: ${results.timeouts}`);
    console.log(`Respostas Não 2xx: ${results.non2xx}`);

    console.log('\nLatência (milissegundos):');
    console.log(`  - Média: ${results.latency.average.toFixed(2)}`);
    console.log(`  - Mínima: ${results.latency.min}`);
    console.log(`  - Máxima: ${results.latency.max}`);

    console.log('\nDetalhes das Requisições (por conexão):');
    console.log(`  - Média: ${results.requests.average.toFixed(2)} (tempo médio de cada requisição)`);
    console.log(`  - Mínima: ${results.requests.min}`);
    console.log(`  - Máxima: ${results.requests.max}`);
  }

  private async generateTxtReport(results: any): Promise<void> {
    const now = new Date();
    const formattedDate = now.toISOString().replace(/:/g, '-'); // Formata a data para uso em nomes de arquivo
    const txtFileName = `autocannon_results_${formattedDate}.txt`;

    try {
      const txtData: string[] = [];
      txtData.push('Resultados do Teste Autocannon');
      txtData.push(`URL: ${results.url}`);
      txtData.push(`Conexões: ${results.connections}`);
      txtData.push(`Duração: ${results.duration.toFixed(2)} segundos`);
      txtData.push(`Total de Requisições: ${results.requests.total}`);
      txtData.push(`Taxa de Requisições (por segundo): ${results.throughput.mean.toFixed(2)}`);
      txtData.push('\nCódigos de Status HTTP:');
      Object.entries(results.statusCodeStats).forEach(([ code, stat ]) => {
        // @ts-ignore
        txtData.push(`  - ${code} (${stat.count} requisições)`);
      });
      txtData.push(`\nErros: ${results.errors}`);
      txtData.push(`Timeouts: ${results.timeouts}`);
      txtData.push(`Respostas Não 2xx: ${results.non2xx}`);
      txtData.push('\nLatência (milissegundos):');
      txtData.push(`  - Média: ${results.latency.average.toFixed(2)}`);
      txtData.push(`  - Mínima: ${results.latency.min}`);
      txtData.push(`  - Máxima: ${results.latency.max}`);
      txtData.push('\nDetalhes das Requisições (por conexão):');
      txtData.push(`  - Média: ${results.requests.average.toFixed(2)} (tempo médio de cada requisição)`);
      txtData.push(`  - Mínima: ${results.requests.min}`);
      txtData.push(`  - Máxima: ${results.requests.max}`);

      // Escreva o arquivo de texto
      await fs.writeFile(txtFileName, txtData.join('\n'), 'utf-8');

      console.log(`Relatório TXT gerado com sucesso: ${txtFileName}`);
    } catch (error) {
      console.error('Erro ao gerar o relatório TXT:', error.message);
    }
  }
}
