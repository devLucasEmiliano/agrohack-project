# Teste da API - Excluir Funcionários

## 📋 Informações da API

- **Endpoint**: `NEXT_PUBLIC_EXCLUIR_FUNCIONARIO_ENV`
- **URL**: `https://n8n-n8n.tscd6m.easypanel.host/webhook/3af2b632-9f93-4885-bd01-cec05b84c355`
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

| Campo             | Tipo   | Formato    | Descrição                                                      |
| ----------------- | ------ | ---------- | -------------------------------------------------------------- |
| `nomeCompleto`    | string | -          | Nome completo do funcionário (deve corresponder ao cadastrado) |
| `matricula`       | string | -          | Matrícula do funcionário                                       |
| `data_nascimento` | string | DD/MM/YYYY | Data de nascimento no formato brasileiro                       |

## 📥 Resposta Esperada

### Sucesso (200 OK)

```json
{
  "delete": "True"
}
```

### Erro (4xx/5xx)

```json
{
  "delete": "False"
}
```

## 🧪 Como Testar

### 1. Via cURL (Windows CMD)

```cmd
curl -X POST "https://n8n-n8n.tscd6m.easypanel.host/webhook/3af2b632-9f93-4885-bd01-cec05b84c355" ^
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

Invoke-RestMethod -Uri "https://n8n-n8n.tscd6m.easypanel.host/webhook/3af2b632-9f93-4885-bd01-cec05b84c355" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

### 3. Via Aplicação (Gerenciamento de Funcionários)

1. Acesse a página de **Gerenciamento de Funcionários**
2. Localize o funcionário que deseja excluir na lista
3. Clique no botão vermelho com ícone de **lixeira** (Trash)
4. Confirme a exclusão no diálogo
5. Aguarde o processamento

**Indicadores de Sucesso:**

- ✅ Funcionário removido da lista
- ✅ Mensagem de confirmação no console
- ✅ Lista atualizada automaticamente

**Indicadores de Erro:**

- ❌ Mensagem de erro em vermelho no topo da página
- ❌ Funcionário permanece na lista
- ❌ Log de erro no console do navegador

## 🔍 Validações Implementadas

### No Frontend (`employees-list.tsx`)

1. **Confirmação do usuário**

   - Diálogo de confirmação antes de excluir
   - Exibe o nome do funcionário para evitar exclusões acidentais

2. **Transformação de dados**

   - Converte data de `YYYY-MM-DD` (interno) para `DD/MM/YYYY` (API)
   - Garante que todos os campos obrigatórios sejam enviados

3. **Estados visuais**

   - Loading durante a exclusão
   - Mensagem de erro se a API falhar
   - Desabilita ações durante o processamento

4. **Tratamento de erros**

   ```typescript
   try {
     await deleteEmployeeAPI({...});
     deleteEmployeeLocal(employee.id);
     await loadEmployees();
   } catch (err) {
     // Exibe erro e mantém funcionário na lista
   }
   ```

5. **Sincronização com localStorage**
   - Remove do cache local após sucesso na API
   - Mantém no cache se a API falhar

## 📝 Formato dos Dados

### Entrada (Interno)

```typescript
{
  id: "123",
  name: "Matheus Costa",
  matricula: "251013698",
  dataNascimento: "2007-01-10", // YYYY-MM-DD
  createdAt: "2025-11-08T10:00:00.000Z"
}
```

### Saída (API)

```json
{
  "nomeCompleto": "Matheus Costa",
  "matricula": "251013698",
  "data_nascimento": "10/01/2007"
}
```

## ⚠️ Observações Importantes

1. **Dados devem corresponder exatamente**

   - Nome, matrícula e data de nascimento devem ser idênticos aos cadastrados
   - Diferenças de capitalização ou espaços podem causar falha na exclusão

2. **Exclusão é permanente**

   - Não há função de "desfazer"
   - Sempre confirme antes de excluir

3. **Validação no backend**

   - A API valida se o funcionário existe antes de excluir
   - Retorna `"delete": "False"` se não encontrar correspondência exata

4. **Atualização automática**
   - Após exclusão bem-sucedida, a lista é recarregada da API
   - Garante sincronização com o estado mais recente

## 🐛 Troubleshooting

### Erro: "Erro de conexão"

- ✅ Verifique sua conexão com a internet
- ✅ Confirme se a URL do webhook está acessível

### Erro: "A API retornou falha na exclusão"

- ✅ Verifique se os dados correspondem exatamente ao cadastro
- ✅ Confirme que o funcionário existe na base de dados

### Funcionário não é removido da lista

- ✅ Verifique o console do navegador para erros
- ✅ Tente atualizar a lista manualmente (botão Atualizar)
- ✅ Verifique se a resposta da API é `{"delete": "True"}`

### Exclusão bem-sucedida mas funcionário reaparece

- ✅ Possível problema de sincronização com a API
- ✅ Limpe o localStorage e recarregue: `localStorage.clear()`
- ✅ Verifique se o funcionário foi realmente excluído no backend

## 📊 Logs de Debug

Para acompanhar o processo de exclusão, abra o **DevTools** (F12) e observe:

```javascript
// Antes da requisição
"Enviando exclusão de funcionário para API:" {
  url: "https://...",
  payload: {...}
}

// Após resposta
"Resposta da API de exclusão:" { delete: "True" }

// Após sincronização
"Funcionário Matheus Costa excluído com sucesso"
```

## 🔗 Arquivos Relacionados

- **API Service**: `lib/api-service.ts` (função `deleteEmployee`)
- **Componente**: `components/employees-list.tsx` (função `handleDelete`)
- **Tipos**: `lib/api-service.ts` (interfaces `DeleteEmployeePayload` e `DeleteEmployeeResponse`)
- **Dados Locais**: `lib/employees-data.ts` (função `deleteEmployee` para localStorage)
