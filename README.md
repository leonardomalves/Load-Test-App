Com certeza! Aqui está o README atualizado com as informações fornecidas:

```markdown
# Teste de Carga com Autocannon

Este é um serviço que utiliza a biblioteca Autocannon para realizar testes de carga em uma API especificada. Ele executa testes, gera relatórios JSON e TXT, e exibe resultados formatados no console.

## Instalação

Certifique-se de ter o Node.js instalado. Clone o repositório e instale as dependências:

```bash
git clone git@github.com:leonardomalves/teste-carga.git
cd teste-carga
yarn install
```

## Uso

### Autocannon Testes

Para executar um teste Autocannon, faça uma solicitação HTTP POST para o endpoint `/autocannon` com o seguinte corpo:

```json
{
  "connections": 10,
  "url": "https://example.com",
  "headers": {
    "Authorization": "Bearer <token>"
  },
  "payload": {
    "key": "value"
  },
  "duration": 10,
  "method": "POST"
}
```

- `connections`: Número de conexões simultâneas.
- `url`: URL do endpoint a ser testado.
- `headers`: Cabeçalhos da solicitação.
- `payload`: Corpo da solicitação.
- `duration`: Duração do teste em segundos.
- `method`: Método HTTP da solicitação.

Após a execução, serão exibidos resultados formatados no console e serão gerados relatórios JSON (`autocannon_report.json`) e TXT (`autocannon_results_<timestamp>.txt`).

### Solicitações em Lote

Além dos testes Autocannon, você também pode enviar solicitações HTTP em lote. Faça uma solicitação HTTP POST para o endpoint `/requests` com o seguinte corpo:

```json
{
  "url": "https://example.com",
  "headers": {
    "Authorization": "Bearer <token>"
  },
  "payload": {
    "key": "value"
  },
  "totalRequest": 100,
  "delayBetweenRequests": 1000, // milissegundos
  "batchSize": 10
}
```

- `url`: URL do endpoint a ser testado.
- `headers`: Cabeçalhos da solicitação.
- `payload`: Corpo da solicitação.
- `totalRequest`: Número total de solicitações a serem enviadas.
- `delayBetweenRequests`: Tempo de espera entre cada solicitação em milissegundos.
- `batchSize`: Tamanho do lote (número de solicitações em cada lote).

Após a execução, serão exibidos resultados no console, incluindo o total de sucesso, total de falhas, tempo total, tempo médio e tempo total por requisição.

## Contribuição

Sinta-se à vontade para contribuir! Fork o repositório, faça suas modificações e envie um pull request.

## Licença

Este projeto é licenciado sob a [Licença MIT](LICENSE). Veja o arquivo LICENSE.md para mais detalhes.
```

Espero que isso ajude! Se precisar de mais alguma coisa ou ajustes, estou à disposição.
