# Impostor Game

API em Node.js + Express + TypeScript para iniciar rodadas do jogo Impostor Game.

## Stack

- Node.js 20+
- Express
- TypeScript
- Vitest + Supertest
- SMS por contrato `SmsService`, com `FakeSmsService` para desenvolvimento

## Como instalar

```bash
npm install
```

Copie as variáveis de ambiente de exemplo se quiser customizar a execução:

```bash
cp .env.example .env
```

## Como rodar

```bash
npm run dev
```

A API sobe por padrão em `http://localhost:3000`.

Também é possível gerar build e rodar o JavaScript compilado:

```bash
npm run build
npm start
```

## Testes

```bash
npm test
```

## Endpoints

### Listar temas

```http
GET /themes
```

Retorna apenas `id` e `nome`. Não expõe palavras nem dicas.

### Detalhe seguro do tema

```http
GET /themes/frutas
```

Resposta:

```json
{
  "id": "frutas",
  "nome": "Frutas",
  "wordsCount": 8
}
```

### Iniciar rodada

```http
POST /games/start
Content-Type: application/json

{
  "themeId": "frutas",
  "players": [
    { "name": "Nader", "phone": "+5511999999999" },
    { "name": "João", "phone": "+5511988888888" },
    { "name": "Maria", "phone": "+5511977777777" }
  ]
}
```

Resposta normal:

```json
{
  "gameId": "uuid",
  "theme": "Frutas",
  "playersCount": 3,
  "messagesSent": 3,
  "status": "STARTED"
}
```

A resposta pública não expõe palavra secreta, dica, impostor nem telefone dos jogadores.

## Modo debug

Por padrão, dados sensíveis não aparecem. Em desenvolvimento, use:

```bash
SHOW_GAME_DEBUG=true npm run dev
```

Com `SHOW_GAME_DEBUG=true`, a resposta de `POST /games/start` inclui:

```json
{
  "debug": {
    "secretWord": "banana",
    "impostor": "Maria",
    "hint": "amarela"
  }
}
```

## Temas e dicas

Os temas, palavras e dicas ficam em [src/data/themes.ts](./src/data/themes.ts).

Para adicionar novos itens, inclua um tema com:

- `id`
- `name`
- `words`

Cada palavra precisa ter:

- `id`
- `value`
- `hint`

A dica deve ser exatamente uma palavra, sem espaços, sem ser igual à palavra secreta e sem conter a palavra secreta como substring.

## SMS

A lógica do jogo depende apenas da interface [SmsService](./src/services/smsService.ts).

O [FakeSmsService](./src/services/fakeSmsService.ts) simula envio, registra no console e retorna sucesso. Para trocar por Twilio, Zenvia, AWS SNS ou outro provedor, crie uma classe que implemente:

```ts
sendSms(phone: string, message: string): Promise<SmsSendResult>
```

Depois atualize [src/services/smsProviderFactory.ts](./src/services/smsProviderFactory.ts) para instanciar o provedor quando `SMS_PROVIDER` apontar para ele.

## Variáveis de ambiente

- `PORT`: porta HTTP. Padrão: `3000`
- `NODE_ENV`: ambiente de execução
- `SHOW_GAME_DEBUG`: expõe debug apenas quando `true`
- `SMS_PROVIDER`: `fake` por padrão
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_PHONE`: reservadas para Twilio
- `ZENVIA_API_TOKEN`, `ZENVIA_FROM`: reservadas para Zenvia
- `AWS_REGION`, `AWS_SNS_SENDER_ID`: reservadas para AWS SNS

## Decisões arquiteturais

- Temas, palavras e dicas são dados locais versionados, sem banco de dados.
- A regra do jogo fica em `GameService`, separada de rotas e controllers.
- O envio de SMS é injetado por contrato para permitir troca de provedor.
- Validações rodam antes de qualquer SMS ser enviado.
- A API retorna um resumo administrativo seguro; detalhes sensíveis só aparecem no modo debug.
