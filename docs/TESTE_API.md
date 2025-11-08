# 🧪 Como Testar a API de Registro de Horas

## Opção 1: Usando o Componente de Teste (RECOMENDADO)

### Passo 1: Adicione o componente de teste em uma página

Abra qualquer página do seu projeto, por exemplo `app/page.tsx` ou `app/(private)/dashboard/page.tsx`, e adicione:

```tsx
import { ApiTestButton } from "@/components/api-test-button";

export default function Page() {
  return (
    <div>
      {/* Seu conteúdo existente */}

      {/* Componente de teste - REMOVA ANTES DE PRODUÇÃO */}
      <ApiTestButton />
    </div>
  );
}
```

### Passo 2: Acesse a página e clique nos botões

- **"Testar com Dados Completos"**: Envia um registro completo com todos os campos preenchidos
- **"Testar com Dados Mínimos"**: Envia apenas os campos obrigatórios

O componente mostrará:

- ✅ Status de sucesso/falha
- 📊 Detalhes da resposta da API
- 🔗 URL da API configurada

### Passo 3: Remova o componente antes de produção!

⚠️ **IMPORTANTE**: Este é um componente apenas para desenvolvimento. Remova-o antes de fazer deploy.

---

## Opção 2: Testando Direto no Console do Browser

### Método Simples (Copy & Paste)

1. Abra o DevTools (F12)
2. Vá para a aba **Console**
3. Copie e cole este código:

```javascript
const API_URL =
  "https://n8n-n8n.tscd6m.easypanel.host/webhook/6d83d48c-d026-46e5-a582-5066a85e34b5";

const testData = {
  OPERADOR_MATRICULA: "12345",
  LOCAL_SERVICO: "-15.7942, -47.8822",
  RA: "III",
  COMUNIDADE: "Taguatinga",
  PROCESSO: "SEI-2024-001",
  DATA: "2024-11-08",
  MAQUINA_PREFIXO: "TR-001",
  IMPLEMENTO_PREFIXO: "AR-001",
  HORIMETRO_INICIAL: "1234",
  HORIMETRO_FINAL: "1240",
  HORA_FINAL: "17:00",
  TOTAL_SERVICO: "6",
  ABASTECIMENTO: "50",
  OBSERVACAO: "Teste via console",
  OPERADOR_NOME: "João Silva",
  SEVICO_REALIZADO: "aracao, gradagem",
};

fetch(API_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(testData),
})
  .then((res) => res.json())
  .then((data) => {
    console.log("✅ Resposta da API:", data);
    if (data.RHT) {
      console.log("✅ Registro criado com sucesso!");
    } else {
      console.log("❌ Falha no registro (RHT: false)");
    }
  })
  .catch((err) => console.error("❌ Erro:", err));
```

4. Pressione **Enter**
5. Veja o resultado no console

---

## Opção 3: Teste via cURL (Terminal)

```bash
curl -X POST https://n8n-n8n.tscd6m.easypanel.host/webhook/6d83d48c-d026-46e5-a582-5066a85e34b5 \
  -H "Content-Type: application/json" \
  -d "{\"OPERADOR_MATRICULA\":\"12345\",\"LOCAL_SERVICO\":\"Campo Norte\",\"RA\":\"III\",\"COMUNIDADE\":\"Taguatinga\",\"PROCESSO\":\"SEI-2024-001\",\"DATA\":\"2024-11-08\",\"MAQUINA_PREFIXO\":\"TR-001\",\"IMPLEMENTO_PREFIXO\":\"AR-001\",\"HORIMETRO_INICIAL\":\"1234\",\"HORIMETRO_FINAL\":\"1240\",\"HORA_FINAL\":\"17:00\",\"TOTAL_SERVICO\":\"6\",\"ABASTECIMENTO\":\"50\",\"OBSERVACAO\":\"Teste\",\"OPERADOR_NOME\":\"João Silva\",\"SEVICO_REALIZADO\":\"aracao, gradagem\"}"
```

---

## Opção 4: Teste via Interface Normal

A maneira mais realista de testar:

1. Acesse `/registerHours` ou `/dashboard/register`
2. Preencha o formulário normalmente
3. Revise os dados na página de confirmação
4. Clique em **"Confirmar e Enviar"**
5. Abra o DevTools > Network para ver a requisição

### Monitorando a Requisição

No DevTools > Network:

1. Filtre por "webhook"
2. Veja o **Request Payload** (dados enviados)
3. Veja o **Response** (resposta da API)
4. Verifique o **Status Code** (deve ser 200)

---

## O que Observar nos Testes

### ✅ Sucesso

```json
{
  "RHT": true
}
```

### ❌ Falha

```json
{
  "RHT": false
}
```

### Erros Comuns

1. **CORS Error**: Verifique se o webhook aceita requisições do seu domínio
2. **Network Error**: Verifique sua conexão com a internet
3. **Timeout**: A API pode estar lenta ou fora do ar
4. **400/500 Status**: Erro no formato dos dados ou problema no servidor

---

## Verificando os Dados no n8n

Após enviar com sucesso, você deve verificar no n8n se os dados foram recebidos:

1. Acesse seu painel do n8n
2. Vá para o workflow que usa este webhook
3. Verifique os logs de execução
4. Confirme que os dados foram processados corretamente

---

## Troubleshooting

### A API não responde

- Verifique se a URL está correta no `.env`
- Teste a URL diretamente no browser
- Verifique se o n8n está online

### Dados não aparecem no n8n

- Confira se o workflow está ativado
- Verifique os logs de erro no n8n
- Confirme que o webhook está correto

### Erro de CORS

- Configure o CORS no webhook do n8n
- Ou use um backend intermediário

---

## 📝 Checklist de Teste

- [ ] Teste com dados completos funcionou
- [ ] Teste com dados mínimos funcionou
- [ ] Resposta da API retorna `{"RHT": true}`
- [ ] Dados aparecem corretamente no n8n
- [ ] Teste via interface normal funciona
- [ ] Mensagens de erro aparecem corretamente
- [ ] Loading aparece durante o envio
- [ ] Redirecionamento após sucesso funciona
- [ ] Dados são salvos no localStorage

---

**Precisa de ajuda?** Verifique os logs no console do browser (F12 > Console) para mais informações sobre erros.
