# Teste de API - Registro de Horas

## 📋 Visão Geral

Este documento fornece instruções para testar a integração com a API de registro de horas.

## 🔧 Configuração

### Variáveis de Ambiente

Certifique-se de que o arquivo `.env` contém:

```env
REGISTRAR_HOURS_ENV=https://n8n-n8n.tscd6m.easypanel.host/webhook/6d83d48c-d026-46e5-a582-5066a85e34b5
NEXT_PUBLIC_REGISTRAR_HOURS_ENV=https://n8n-n8n.tscd6m.easypanel.host/webhook/6d83d48c-d026-46e5-a582-5066a85e34b5
```

⚠️ **Importante**: A variável com `NEXT_PUBLIC_` é exposta no cliente (browser).

## 🧪 Teste Manual via cURL

### Exemplo de Requisição

```bash
curl -X POST https://n8n-n8n.tscd6m.easypanel.host/webhook/6d83d48c-d026-46e5-a582-5066a85e34b5 \
  -H "Content-Type: application/json" \
  -d '{
    "OPERADOR_MATRICULA": "12345",
    "LOCAL_SERVICO": "Campo Norte - GPS: -15.7801, -47.9292",
    "RA": "III",
    "COMUNIDADE": "Taguatinga",
    "PROCESSO": "SEI-2024-001234",
    "DATA": "2025-11-08",
    "MAQUINA_PREFIXO": "TR-001",
    "IMPLEMENTO_PREFIXO": "AR-001",
    "HORIMETRO_INICIAL": "1234",
    "HORIMETRO_FINAL": "1240",
    "HORA_FINAL": "17:00",
    "TOTAL_SERVICO": "6.5",
    "ABASTECIMENTO": "50",
    "OBSERVACAO": "Teste de integração - Serviço realizado conforme planejado",
    "OPERADOR_NOME": "João Silva",
    "SEVICO_REALIZADO": "aracao, gradagem, semeadura"
  }'
```

### Resposta Esperada

```json
{
  "RHT": true
}
```

- **RHT: true** = Registro criado com sucesso ✅
- **RHT: false** = Falha no registro ❌

## 🌐 Teste via Aplicação Web

### 1. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

### 2. Acesse a página de registro

Navegue para: `http://localhost:3000/registerHours`

### 3. Preencha o formulário

Preencha todos os campos do formulário através do chatbot:

#### Passo 1 - Informações Pessoais

- **Nome do Operador**: João Silva
- **Matrícula**: 12345
- **Local do Serviço**: (use GPS ou digite manualmente)
- **Sigla RA**: III
- **Comunidade**: Taguatinga

#### Passo 2 - Detalhes do Serviço

- **Processo SEI**: SEI-2024-001234
- **Data**: 08/11/2025
- **Hora Início**: 08:00
- **Hora Fim**: 17:00

#### Passo 3 - Máquinas e Implementos

- **Máquina**: Trator John Deere
- **Prefixo Máquina**: TR-001
- **Implementos**: Arado
- **Prefixo Implementos**: AR-001

#### Passo 4 - Horímetros e Serviços

- **Horímetro Inicial**: 1234
- **Horímetro Final**: 1240
- **Total do Serviço**: 6.5
- **Unidade**: ha (hectares)
- **Abastecimento**: 50 litros
- **Serviços**: Selecione "Aração", "Gradagem", "Semeadura"

#### Passo 5 - Observações

- Digite observações adicionais se necessário

### 4. Confirme os dados

Revise todos os dados na página de confirmação e clique em **"Confirmar e Enviar"**.

### 5. Verifique o resultado

- ✅ **Sucesso**: Mensagem "Enviado com Sucesso!" aparece
- ❌ **Erro**: Mensagem de erro é exibida com detalhes

## 🔍 Debugging

### Verificar no Console do Navegador

1. Abra o DevTools (F12)
2. Vá para a aba **Console**
3. Procure por:
   - `Enviando dados para API:` - mostra o payload
   - `Resposta da API:` - mostra a resposta

### Verificar Requisições na Aba Network

1. Abra o DevTools (F12)
2. Vá para a aba **Network**
3. Faça um registro
4. Procure pela requisição para o webhook
5. Clique nela para ver:
   - **Headers**: Cabeçalhos da requisição
   - **Payload**: Dados enviados
   - **Response**: Resposta da API

### Erros Comuns

#### 1. "URL da API não configurada"

**Causa**: Variável de ambiente não encontrada
**Solução**:

- Verifique se `.env` está na raiz do projeto
- Reinicie o servidor de desenvolvimento
- Verifique se a variável tem o prefixo `NEXT_PUBLIC_`

#### 2. "Erro de conexão. Verifique sua internet"

**Causa**: Falha na conexão de rede
**Solução**:

- Verifique sua conexão com a internet
- Verifique se a URL do webhook está acessível
- Teste com curl no terminal

#### 3. "A API retornou falha no registro (RHT: false)"

**Causa**: API processou a requisição mas retornou falha
**Solução**:

- Verifique os logs do n8n
- Verifique se todos os campos obrigatórios foram preenchidos
- Verifique a validação de dados no webhook

#### 4. "Erro HTTP: 404" ou "Erro HTTP: 500"

**Causa**: Webhook não encontrado ou erro no servidor
**Solução**:

- Verifique se a URL do webhook está correta
- Verifique se o workflow no n8n está ativo
- Verifique os logs do n8n

## 📊 Estrutura do Payload

### Mapeamento de Campos

| Campo do Formulário       | Campo da API         | Obrigatório | Exemplo            |
| ------------------------- | -------------------- | ----------- | ------------------ |
| `matricula`               | `OPERADOR_MATRICULA` | ✅          | "12345"            |
| `localServico`            | `LOCAL_SERVICO`      | ✅          | "Campo Norte"      |
| `raSignla`                | `RA`                 | ✅          | "III"              |
| `comunidade`              | `COMUNIDADE`         | ✅          | "Taguatinga"       |
| `processo`                | `PROCESSO`           | ✅          | "SEI-2024-001234"  |
| `data`                    | `DATA`               | ✅          | "2025-11-08"       |
| `prefixoMaquina`          | `MAQUINA_PREFIXO`    | ✅          | "TR-001"           |
| `prefixoImplementos`      | `IMPLEMENTO_PREFIXO` | ✅          | "AR-001"           |
| `horimetroInicial`        | `HORIMETRO_INICIAL`  | ✅          | "1234"             |
| `horimetroFinal`          | `HORIMETRO_FINAL`    | ✅          | "1240"             |
| `horaFim`                 | `HORA_FINAL`         | ✅          | "17:00"            |
| `totalServico`            | `TOTAL_SERVICO`      | ✅          | "6.5"              |
| `abastecimento`           | `ABASTECIMENTO`      | ✅          | "50"               |
| `observacoes`             | `OBSERVACAO`         | ❌          | "Observações..."   |
| `operador`                | `OPERADOR_NOME`      | ✅          | "João Silva"       |
| `servicos` (selecionados) | `SEVICO_REALIZADO`   | ✅          | "aracao, gradagem" |

### Exemplo de Payload Completo

```json
{
  "OPERADOR_MATRICULA": "12345",
  "LOCAL_SERVICO": "Campo Norte - GPS: -15.7801, -47.9292",
  "RA": "III",
  "COMUNIDADE": "Taguatinga",
  "PROCESSO": "SEI-2024-001234",
  "DATA": "2025-11-08",
  "MAQUINA_PREFIXO": "TR-001",
  "IMPLEMENTO_PREFIXO": "AR-001",
  "HORIMETRO_INICIAL": "1234",
  "HORIMETRO_FINAL": "1240",
  "HORA_FINAL": "17:00",
  "TOTAL_SERVICO": "6.5",
  "ABASTECIMENTO": "50",
  "OBSERVACAO": "Teste de integração",
  "OPERADOR_NOME": "João Silva",
  "SEVICO_REALIZADO": "aracao, gradagem, semeadura"
}
```

## 💾 Backup Local

Após o envio bem-sucedido, os dados são salvos automaticamente no `localStorage` do navegador como backup:

```javascript
// Estrutura do backup
{
  id: "1699459200000",
  ...formData,
  createdAt: "2025-11-08T14:30:00.000Z",
  rhtStatus: true
}
```

### Acessar Backup no Console

```javascript
// Ver todos os registros salvos
const records = JSON.parse(localStorage.getItem("workHoursRecords") || "[]");
console.table(records);

// Limpar registros (use com cuidado!)
// localStorage.removeItem('workHoursRecords');
```

## 🔐 Segurança

⚠️ **Avisos de Segurança**:

1. A URL do webhook está exposta no código client-side
2. Qualquer pessoa pode enviar dados para o webhook
3. Não há autenticação implementada

**Recomendações**:

- Implementar autenticação no webhook (token, API key)
- Adicionar rate limiting para prevenir abuso
- Validar todos os dados no servidor (n8n)
- Considerar usar um backend intermediário (Next.js API Route)

## 📝 Logs e Auditoria

### Logs no Console do Navegador

Todos os envios são logados:

```javascript
console.log("Enviando dados para API:", { url, payload });
console.log("Resposta da API:", data);
```

### Logs no n8n

Acesse o workflow no n8n para ver:

- Requisições recebidas
- Validações executadas
- Erros ocorridos
- Dados processados

## ✅ Checklist de Teste

- [ ] Servidor de desenvolvimento rodando
- [ ] Variáveis de ambiente configuradas
- [ ] Preencher formulário completo
- [ ] Confirmar dados na página de confirmação
- [ ] Verificar mensagem de sucesso
- [ ] Verificar logs no console do navegador
- [ ] Verificar requisição na aba Network
- [ ] Verificar dados no n8n/banco de dados
- [ ] Testar tratamento de erro (desconectar internet)
- [ ] Verificar backup no localStorage

## 🚀 Próximos Passos

- [ ] Implementar retry automático em caso de falha
- [ ] Adicionar queue offline com sincronização posterior
- [ ] Implementar validação de dados mais robusta
- [ ] Criar dashboard de envios bem-sucedidos/falhos
- [ ] Adicionar logs de auditoria
- [ ] Implementar autenticação no webhook
- [ ] Adicionar testes automatizados

## 📞 Suporte

Se encontrar problemas:

1. Verifique o console do navegador para erros
2. Verifique a aba Network para detalhes da requisição
3. Verifique os logs do n8n
4. Revise este documento para soluções comuns
5. Entre em contato com a equipe de desenvolvimento
