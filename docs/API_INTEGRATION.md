# Integração com API de Registro de Horas

## Visão Geral

Este documento descreve a integração do sistema de registro de horas com a API do n8n através de webhook.

## Configuração

### Variáveis de Ambiente

A URL da API é configurada no arquivo `.env`:

```env
REGISTRAR_HOURS_ENV=https://n8n-n8n.tscd6m.easypanel.host/webhook/6d83d48c-d026-46e5-a582-5066a85e34b5
NEXT_PUBLIC_REGISTRAR_HOURS_ENV=https://n8n-n8n.tscd6m.easypanel.host/webhook/6d83d48c-d026-46e5-a582-5066a85e34b5
```

**Importante**: A variável com prefixo `NEXT_PUBLIC_` é exposta no lado do cliente (browser).

## Fluxo de Dados

### 1. Coleta de Dados

O usuário preenche o formulário através do componente `ChatBot` (`components/chat-bot.tsx`), que coleta as seguintes informações:

```typescript
type FormData = {
  operador: string;
  matricula: string;
  localServico: string;
  raSignla: string;
  comunidade: string;
  processo: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  maquina: string;
  prefixoMaquina: string;
  implementos: string;
  prefixoImplementos: string;
  horimetroInicial: string;
  horimetroFinal: string;
  totalServico: string;
  unidadeServico: string;
  abastecimento: string;
  servicos: Record<string, { selected: boolean; unidade: string }>;
  observacoes: string;
};
```

### 2. Confirmação

Os dados são apresentados ao usuário na página de confirmação (`components/confirmation-page.tsx`), onde ele pode:

- Revisar todos os campos
- Editar campos individuais
- Confirmar o envio

### 3. Envio para API

Quando o usuário confirma, os dados são transformados e enviados para a API através do serviço `lib/api-service.ts`.

#### Formato do Payload

O payload enviado para a API segue este formato:

```json
{
  "OPERADOR_MATRICULA": "string",
  "LOCAL_SERVICO": "string",
  "RA": "string",
  "COMUNIDADE": "string",
  "PROCESSO": "string",
  "DATA": "string (YYYY-MM-DD)",
  "MAQUINA_PREFIXO": "string",
  "IMPLEMENTO_PREFIXO": "string",
  "HORIMETRO_INICIAL": "string",
  "HORIMETRO_FINAL": "string",
  "HORA_FINAL": "string (HH:MM)",
  "TOTAL_SERVICO": "string",
  "ABASTECIMENTO": "string",
  "OBSERVACAO": "string",
  "OPERADOR_NOME": "string",
  "SEVICO_REALIZADO": "string (serviços separados por vírgula)"
}
```

#### Mapeamento de Campos

| Campo FormData       | Campo API            | Transformação                                   |
| -------------------- | -------------------- | ----------------------------------------------- |
| `matricula`          | `OPERADOR_MATRICULA` | Direto                                          |
| `localServico`       | `LOCAL_SERVICO`      | Direto                                          |
| `raSignla`           | `RA`                 | Direto                                          |
| `comunidade`         | `COMUNIDADE`         | Direto                                          |
| `processo`           | `PROCESSO`           | Direto                                          |
| `data`               | `DATA`               | Direto (formato ISO)                            |
| `prefixoMaquina`     | `MAQUINA_PREFIXO`    | Direto                                          |
| `prefixoImplementos` | `IMPLEMENTO_PREFIXO` | Direto                                          |
| `horimetroInicial`   | `HORIMETRO_INICIAL`  | Direto                                          |
| `horimetroFinal`     | `HORIMETRO_FINAL`    | Direto                                          |
| `horaFim`            | `HORA_FINAL`         | Direto                                          |
| `totalServico`       | `TOTAL_SERVICO`      | Direto                                          |
| `abastecimento`      | `ABASTECIMENTO`      | Direto                                          |
| `observacoes`        | `OBSERVACAO`         | Direto                                          |
| `operador`           | `OPERADOR_NOME`      | Direto                                          |
| `servicos`           | `SEVICO_REALIZADO`   | Extrai IDs dos selecionados e junta com vírgula |

### 4. Resposta da API

A API retorna uma resposta simples:

```json
{
  "RHT": boolean
}
```

- `RHT: true` - Registro criado com sucesso
- `RHT: false` - Falha no registro

## Tratamento de Erros

### Erros de Rede

```typescript
try {
  const response = await registerHours(formData);
} catch (error) {
  // Erro de rede ou timeout
  console.error("Erro ao registrar horas:", error);
}
```

### Erros da API

```typescript
if (!response.RHT) {
  throw new Error("A API retornou falha no registro (RHT: false)");
}
```

### Feedback Visual

Os erros são exibidos na interface com:

- Ícone de alerta
- Mensagem de erro descritiva
- Sugestão para verificar conexão

## Backup Local

Após o envio bem-sucedido, os dados são salvos também no `localStorage` como backup:

```typescript
const records = JSON.parse(localStorage.getItem("workHoursRecords") || "[]");
records.push({
  id: Date.now().toString(),
  ...localData,
  createdAt: new Date().toISOString(),
  rhtStatus: response.RHT,
});
localStorage.setItem("workHoursRecords", JSON.stringify(records));
```

## Testes

### Testar Envio Manual

Você pode testar o envio usando curl:

```bash
curl -X POST https://n8n-n8n.tscd6m.easypanel.host/webhook/6d83d48c-d026-46e5-a582-5066a85e34b5 \
  -H "Content-Type: application/json" \
  -d '{
    "OPERADOR_MATRICULA": "12345",
    "LOCAL_SERVICO": "Campo Norte",
    "RA": "III",
    "COMUNIDADE": "Taguatinga",
    "PROCESSO": "SEI-2024-001",
    "DATA": "2024-11-08",
    "MAQUINA_PREFIXO": "TR-001",
    "IMPLEMENTO_PREFIXO": "AR-001",
    "HORIMETRO_INICIAL": "1234",
    "HORIMETRO_FINAL": "1240",
    "HORA_FINAL": "17:00",
    "TOTAL_SERVICO": "6",
    "ABASTECIMENTO": "50",
    "OBSERVACAO": "Teste de integração",
    "OPERADOR_NOME": "João Silva",
    "SEVICO_REALIZADO": "aracao, gradagem"
  }'
```

### Verificar no Console do Browser

1. Abra DevTools (F12)
2. Vá para a aba Network
3. Faça um registro
4. Procure pela requisição para o webhook
5. Verifique o payload e a resposta

## Segurança

⚠️ **Atenção**: A URL do webhook está exposta no código client-side. Considere:

1. Implementar autenticação no webhook
2. Adicionar rate limiting
3. Validar dados no servidor
4. Usar um backend intermediário se necessário

## Arquivos Envolvidos

- `lib/api-service.ts` - Lógica de envio para API
- `components/confirmation-page.tsx` - UI de confirmação e envio
- `components/chat-bot.tsx` - Coleta de dados
- `app/(public)/registerHours/page.tsx` - Página pública de registro
- `.env` - Configuração da URL da API

## Próximos Passos

- [ ] Adicionar retry automático em caso de falha
- [ ] Implementar queue offline com sincronização posterior
- [ ] Adicionar validação mais robusta dos dados
- [ ] Criar relatórios de envios bem-sucedidos/falhos
- [ ] Implementar logs de auditoria
