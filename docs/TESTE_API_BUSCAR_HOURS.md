# Teste da API - Buscar Horas do Funcionário

## 📋 Informações da API

- **Endpoint**: `NEXT_PUBLIC_BUSCAR_HOURS_FUNCIONARIO_ENV`
- **URL**: `https://n8n-n8n.tscd6m.easypanel.host/webhook/d0e53ddb-c61d-4f53-a47f-40c7092021c2`
- **Método**: POST
- **Content-Type**: application/json

## 📤 Payload de Requisição

```json
{
  "nomeCompleto": "matheus costa",
  "matricula": "251013698",
  "data_nascimento": "10/01/2007"
}
```

### Campos Obrigatórios

| Campo             | Tipo   | Formato    | Descrição                                |
| ----------------- | ------ | ---------- | ---------------------------------------- |
| `nomeCompleto`    | string | -          | Nome completo do funcionário             |
| `matricula`       | string | -          | Matrícula do funcionário                 |
| `data_nascimento` | string | DD/MM/YYYY | Data de nascimento no formato brasileiro |

## 📥 Resposta Esperada

### Sucesso (200 OK)

Array de registros de horas do funcionário:

```json
[
  {
    "OPERADOR_MATRICULA": "251013698",
    "OPERADOR_NOME": "matheus costa",
    "LOCAL_SERVICO": "Fazenda São José",
    "RA": "RA-001",
    "COMUNIDADE": "Comunidade Rural",
    "PROCESSO": "Plantio",
    "DATA": "08/11/2025",
    "MAQUINA_PREFIXO": "TRAT-001",
    "IMPLEMENTO_PREFIXO": "PLAN-001",
    "HORIMETRO_INICIAL": "100.5",
    "HORIMETRO_FINAL": "108.5",
    "HORA_FINAL": "17:00",
    "TOTAL_SERVICO": "8.0",
    "ABASTECIMENTO": "Diesel - 50L",
    "OBSERVACAO": "Plantio finalizado conforme planejado",
    "SEVICO_REALIZADO": "Plantio de Soja",
    "id": 123,
    "createdAt": "2025-11-08T10:00:00.000Z",
    "updatedAt": "2025-11-08T10:00:00.000Z"
  }
]
```

### Resposta Vazia (200 OK)

Quando não há registros:

```json
[]
```

## 🧪 Como Testar

### 1. Via cURL (Windows CMD)

```cmd
curl -X POST "https://n8n-n8n.tscd6m.easypanel.host/webhook/d0e53ddb-c61d-4f53-a47f-40c7092021c2" ^
  -H "Content-Type: application/json" ^
  -d "{\"nomeCompleto\":\"matheus costa\",\"matricula\":\"251013698\",\"data_nascimento\":\"10/01/2007\"}"
```

### 2. Via PowerShell

```powershell
$body = @{
    nomeCompleto = "matheus costa"
    matricula = "251013698"
    data_nascimento = "10/01/2007"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://n8n-n8n.tscd6m.easypanel.host/webhook/d0e53ddb-c61d-4f53-a47f-40c7092021c2" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

### 3. Via Aplicação (Consultar Folha)

#### Página Pública: `/consultHours`

1. Acesse a página **Consultar Folha de Horas**
2. Preencha o **Nome completo**
3. Preencha a **Matrícula**
4. Selecione a **Data de nascimento**
5. Clique em **Consultar**

#### Dashboard: `/dashboard/consult`

1. Faça login no sistema
2. Acesse **Dashboard > Consultar**
3. Preencha os dados do funcionário
4. Clique em **Consultar**

**Indicadores de Sucesso:**

- ✅ Exibição dos registros encontrados
- ✅ Total de horas calculado
- ✅ Lista dos últimos registros
- ✅ Informações do funcionário validadas

**Indicadores de Erro:**

- ❌ Mensagem "Nenhum registro encontrado"
- ❌ Mensagem de erro de conexão
- ❌ Log de erro no console do navegador

## 🔍 Validações Implementadas

### No Frontend (`consult-flow.tsx`)

1. **Validação dos campos**

   - Nome completo obrigatório
   - Matrícula obrigatória
   - Data de nascimento obrigatória

2. **Transformação de dados**

   - Converte data de `YYYY-MM-DD` (input) para `DD/MM/YYYY` (API)
   - Transforma resposta da API para formato interno

3. **Estados visuais**

   - Loading durante busca
   - Mensagem de erro se falhar
   - Exibição de resultados formatados

4. **Tratamento de resposta**

   ```typescript
   try {
     const hoursRecords = await fetchEmployeeHours({...});
     if (hoursRecords.length === 0) {
       setStatus("error");
       setServerMessage("Nenhum registro encontrado");
     }
   } catch (error) {
     setStatus("error");
     setServerMessage(error.message);
   }
   ```

5. **Conversão de dados**
   - Mapeia campos da API para formato interno:
     - `SEVICO_REALIZADO` → `activity`
     - `TOTAL_SERVICO` → `hoursWorked` (convertido para número)
     - `LOCAL_SERVICO` → `location`
     - `DATA` → `date`

## 📝 Formato dos Dados

### Entrada (Formulário)

```typescript
{
  nome: "Matheus Costa",
  matricula: "251013698",
  dataNascimento: "2007-01-10" // YYYY-MM-DD
}
```

### Payload (API)

```json
{
  "nomeCompleto": "Matheus Costa",
  "matricula": "251013698",
  "data_nascimento": "10/01/2007"
}
```

### Resposta da API

```json
[
  {
    "OPERADOR_MATRICULA": "251013698",
    "OPERADOR_NOME": "Matheus Costa",
    "LOCAL_SERVICO": "Fazenda",
    "RA": "RA-001",
    "COMUNIDADE": "Rural",
    "PROCESSO": "Plantio",
    "DATA": "08/11/2025",
    "MAQUINA_PREFIXO": "TRAT-001",
    "IMPLEMENTO_PREFIXO": "PLAN-001",
    "HORIMETRO_INICIAL": "100.5",
    "HORIMETRO_FINAL": "108.5",
    "HORA_FINAL": "17:00",
    "TOTAL_SERVICO": "8.0",
    "ABASTECIMENTO": "Diesel - 50L",
    "OBSERVACAO": "Observação",
    "SEVICO_REALIZADO": "Plantio de Soja",
    "id": 123,
    "createdAt": "2025-11-08T10:00:00.000Z",
    "updatedAt": "2025-11-08T10:00:00.000Z"
  }
]
```

### Formato Interno (TimesheetEntry)

```typescript
{
  id: "123",
  employeeId: "251013698",
  employeeName: "Matheus Costa",
  date: "08/11/2025",
  startTime: "100.5",
  endTime: "108.5",
  activity: "Plantio de Soja",
  hoursWorked: 8.0,
  location: "Fazenda",
  createdAt: "2025-11-08T10:00:00.000Z"
}
```

## 📊 Informações Exibidas

### Card de Resultado

1. **Chips Informativos**

   - 👤 Funcionário (nome)
   - 📍 Matrícula
   - 📅 Data de cadastro
   - 🕐 Total de horas trabalhadas

2. **Último Registro**

   - Data
   - Horário (início - fim)
   - Atividade realizada

3. **Últimos 3 Registros**

   - Atividade
   - Data
   - Horas trabalhadas

4. **Ações**
   - Nova consulta (limpa o formulário)
   - Abrir dashboard (redireciona)

## ⚠️ Observações Importantes

1. **Dados devem corresponder exatamente**

   - Nome, matrícula e data devem estar cadastrados no sistema
   - A API retorna array vazio se não encontrar correspondência

2. **Formato de data**

   - Input do formulário: `YYYY-MM-DD`
   - Enviado para API: `DD/MM/YYYY`
   - Exibido ao usuário: `DD/MM/YYYY`

3. **Total de horas**

   - Calculado somando o campo `TOTAL_SERVICO` de todos os registros
   - Convertido de string para número
   - Exibido com 1 casa decimal

4. **Exibição progressiva**
   - Campos aparecem conforme o usuário preenche
   - UX animada e intuitiva

## 🐛 Troubleshooting

### Erro: "Erro de conexão"

- ✅ Verifique sua conexão com a internet
- ✅ Confirme se a URL do webhook está acessível
- ✅ Teste com cURL/PowerShell separadamente

### "Nenhum registro encontrado para esta combinação"

- ✅ Verifique se os dados estão corretos
- ✅ Confirme que o funcionário está cadastrado
- ✅ Verifique se há registros de horas para este funcionário

### Dados não aparecem formatados

- ✅ Verifique o console do navegador para erros
- ✅ Confirme que a API está retornando dados no formato esperado
- ✅ Verifique se os campos estão mapeados corretamente

### Total de horas incorreto

- ✅ Verifique se `TOTAL_SERVICO` é um número válido
- ✅ Confirme a conversão de string para número
- ✅ Verifique se há registros sem o campo `TOTAL_SERVICO`

## 📊 Logs de Debug

Para acompanhar o processo de busca, abra o **DevTools** (F12) e observe:

```javascript
// Antes da requisição
"Buscando horas do funcionário:" {
  url: "https://...",
  payload: {
    nomeCompleto: "...",
    matricula: "...",
    data_nascimento: "..."
  }
}

// Após resposta
"3 registro(s) de horas encontrado(s)"

// Conversão de dados
entries: [
  { id: "123", employeeName: "...", activity: "...", ... }
]
```

## 🔗 Arquivos Relacionados

- **API Service**: `lib/api-service.ts` (função `fetchEmployeeHours`)
- **Componente**: `components/consult-flow.tsx` (função `handleSubmit`)
- **Tipos**:
  - `lib/api-service.ts` (interfaces `FetchEmployeeHoursPayload` e `EmployeeHoursRecord`)
  - `lib/timesheet-data.ts` (interface `TimesheetEntry`)
- **Páginas**:
  - `app/(public)/consultHours/page.tsx` (página pública)
  - `app/(private)/dashboard/consult/page.tsx` (dashboard)

## 🚀 Melhorias Futuras

- [ ] Filtros por data (início e fim)
- [ ] Exportação de dados (PDF/Excel)
- [ ] Gráficos de horas trabalhadas
- [ ] Comparativo mensal
- [ ] Download de comprovante
- [ ] Paginação para muitos registros
