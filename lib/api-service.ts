/**
 * Serviço para integração com API de Registro de Horas
 *
 * Este arquivo contém as funções para enviar dados de registro de horas
 * para a API do n8n através de webhook.
 */

import type { FormData } from "@/components/chat-bot";

/**
 * Resposta da API de registro de horas
 */
export interface RegisterHoursResponse {
  RHT: boolean;
}

/**
 * Payload enviado para a API de registro de horas
 */
export interface RegisterHoursPayload {
  OPERADOR_MATRICULA: string;
  LOCAL_SERVICO: string;
  RA: string;
  COMUNIDADE: string;
  PROCESSO: string;
  DATA: string;
  MAQUINA_PREFIXO: string;
  IMPLEMENTO_PREFIXO: string;
  HORIMETRO_INICIAL: string;
  HORIMETRO_FINAL: string;
  HORA_FINAL: string;
  TOTAL_SERVICO: string;
  ABASTECIMENTO: string;
  OBSERVACAO: string;
  OPERADOR_NOME: string;
  SEVICO_REALIZADO: string;
}

/**
 * Transforma os dados do formulário no formato esperado pela API
 */
function transformFormDataToPayload(formData: FormData): RegisterHoursPayload {
  // Extrai os serviços selecionados
  const servicosSelecionados = Object.entries(formData.servicos || {})
    .filter(([, data]) => data.selected)
    .map(([id]) => id)
    .join(", ");

  return {
    OPERADOR_MATRICULA: formData.matricula || "",
    LOCAL_SERVICO: formData.localServico || "",
    RA: formData.raSignla || "",
    COMUNIDADE: formData.comunidade || "",
    PROCESSO: formData.processo || "",
    DATA: formData.data || "",
    MAQUINA_PREFIXO: formData.prefixoMaquina || "",
    IMPLEMENTO_PREFIXO: formData.prefixoImplementos || "",
    HORIMETRO_INICIAL: formData.horimetroInicial || "",
    HORIMETRO_FINAL: formData.horimetroFinal || "",
    HORA_FINAL: formData.horaFim || "",
    TOTAL_SERVICO: formData.totalServico || "",
    ABASTECIMENTO: formData.abastecimento || "",
    OBSERVACAO: formData.observacoes || "",
    OPERADOR_NOME: formData.operador || "",
    SEVICO_REALIZADO: servicosSelecionados,
  };
}

/**
 * Envia os dados de registro de horas para a API
 *
 * @param formData - Dados do formulário de registro
 * @returns Promise com a resposta da API
 * @throws Error se a requisição falhar ou a API retornar erro
 */
export async function registerHours(
  formData: FormData
): Promise<RegisterHoursResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_REGISTRAR_HOURS_ENV;

  if (!apiUrl) {
    throw new Error(
      "URL da API não configurada. Verifique a variável NEXT_PUBLIC_REGISTRAR_HOURS_ENV"
    );
  }

  // Transforma os dados do formulário
  const payload = transformFormDataToPayload(formData);

  console.log("Enviando dados para API:", {
    url: apiUrl,
    payload,
  });

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }

    const data: RegisterHoursResponse = await response.json();

    console.log("Resposta da API:", data);

    // Verifica se o registro foi bem-sucedido
    if (!data.RHT) {
      throw new Error("A API retornou falha no registro (RHT: false)");
    }

    return data;
  } catch (error) {
    console.error("Erro ao registrar horas:", error);

    // Re-lança o erro com mensagem mais amigável
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        "Erro de conexão. Verifique sua internet e tente novamente."
      );
    }

    throw error;
  }
}

/**
 * Salva o registro localmente como backup
 *
 * @param formData - Dados do formulário
 * @param rhtStatus - Status retornado pela API
 */
export function saveLocalBackup(formData: FormData, rhtStatus: boolean): void {
  try {
    const records = JSON.parse(
      localStorage.getItem("workHoursRecords") || "[]"
    );

    records.push({
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      rhtStatus,
    });

    localStorage.setItem("workHoursRecords", JSON.stringify(records));
  } catch (error) {
    console.error("Erro ao salvar backup local:", error);
  }
}

// ============================================
// CADASTRO DE FUNCIONÁRIOS
// ============================================

/**
 * Payload para cadastro de funcionário
 */
export interface RegisterEmployeePayload {
  nomeCompleto: string;
  matricula: string;
  data_nascimento: string;
}

/**
 * Resposta da API de cadastro de funcionário
 * (ajuste conforme o formato real retornado pela API)
 */
export interface RegisterEmployeeResponse {
  success?: boolean;
  message?: string;
  id?: string;
  [key: string]: unknown; // Para flexibilidade caso a resposta tenha outros campos
}

/**
 * Cadastra um novo funcionário via API
 *
 * @param employeeData - Dados do funcionário
 * @returns Promise com a resposta da API
 * @throws Error se a requisição falhar
 */
export async function registerEmployee(
  employeeData: RegisterEmployeePayload
): Promise<RegisterEmployeeResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_CADASTRO_FUNCIONARIO_ENV;

  if (!apiUrl) {
    throw new Error(
      "URL da API não configurada. Verifique a variável NEXT_PUBLIC_CADASTRO_FUNCIONARIO_ENV"
    );
  }

  console.log("Enviando cadastro de funcionário para API:", {
    url: apiUrl,
    payload: employeeData,
  });

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }

    const data: RegisterEmployeeResponse = await response.json();

    console.log("Resposta da API de cadastro:", data);

    return data;
  } catch (error) {
    console.error("Erro ao cadastrar funcionário:", error);

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        "Erro de conexão. Verifique sua internet e tente novamente."
      );
    }

    throw error;
  }
}

/**
 * Funcionário retornado pela API
 */
export interface EmployeeFromAPI {
  NOME: string;
  MATRICULA: string;
  DATA_NASCIMENTO: string;
  id: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Obtém a lista de funcionários da API
 *
 * @returns Promise com array de funcionários
 * @throws Error se a requisição falhar
 */
export async function fetchEmployees(): Promise<EmployeeFromAPI[]> {
  const apiUrl = process.env.NEXT_PUBLIC_OBTER_FUNCIONARIO_ENV;

  if (!apiUrl) {
    throw new Error(
      "URL da API não configurada. Verifique a variável NEXT_PUBLIC_OBTER_FUNCIONARIO_ENV"
    );
  }

  console.log("Buscando funcionários da API:", apiUrl);

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }

    const data: EmployeeFromAPI[] = await response.json();

    console.log(`${data.length} funcionário(s) obtido(s) da API`);

    return data;
  } catch (error) {
    console.error("Erro ao buscar funcionários:", error);

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        "Erro de conexão. Verifique sua internet e tente novamente."
      );
    }

    throw error;
  }
}

// ============================================
// EXCLUIR FUNCIONÁRIO
// ============================================

/**
 * Payload para exclusão de funcionário
 */
export interface DeleteEmployeePayload {
  nomeCompleto: string;
  matricula: string;
  data_nascimento: string;
}

/**
 * Resposta da API de exclusão de funcionário
 */
export interface DeleteEmployeeResponse {
  delete: string; // "True" ou "False"
}

/**
 * Exclui um funcionário via API
 *
 * @param employeeData - Dados do funcionário a ser excluído
 * @returns Promise com a resposta da API
 * @throws Error se a requisição falhar ou a exclusão não for bem-sucedida
 */
export async function deleteEmployee(
  employeeData: DeleteEmployeePayload
): Promise<DeleteEmployeeResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_EXCLUIR_FUNCIONARIO_ENV;

  if (!apiUrl) {
    throw new Error(
      "URL da API não configurada. Verifique a variável NEXT_PUBLIC_EXCLUIR_FUNCIONARIO_ENV"
    );
  }

  console.log("Enviando exclusão de funcionário para API:", {
    url: apiUrl,
    payload: employeeData,
  });

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }

    const data: DeleteEmployeeResponse = await response.json();

    console.log("Resposta da API de exclusão:", data);

    // Verifica se a exclusão foi bem-sucedida
    if (data.delete !== "True") {
      throw new Error("A API retornou falha na exclusão");
    }

    return data;
  } catch (error) {
    console.error("Erro ao excluir funcionário:", error);

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        "Erro de conexão. Verifique sua internet e tente novamente."
      );
    }

    throw error;
  }
}

// ============================================
// BUSCAR HORAS DO FUNCIONÁRIO
// ============================================

/**
 * Payload para buscar horas do funcionário
 */
export interface FetchEmployeeHoursPayload {
  OPERADOR_NOME: string;
  OPERADOR_MATRICULA: string;
}

/**
 * Registro de horas do funcionário retornado pela API
 */
export interface EmployeeHoursRecord {
  OPERADOR_MATRICULA: string;
  OPERADOR_NOME: string;
  LOCAL_SERVICO: string;
  RA: string;
  COMUNIDADE: string;
  PROCESSO: string;
  DATA: string;
  MAQUINA_PREFIXO: string;
  IMPLEMENTO_PREFIXO: string;
  HORIMETRO_INICIAL: string;
  HORIMETRO_FINAL: string;
  HORA_INICIAL?: string;
  HORA_FINAL: string;
  TOTAL_SERVICO: string;
  ABASTECIMENTO: string;
  OBSERVACAO: string;
  SEVICO_REALIZADO: string;
  id?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Busca os registros de horas de um funcionário via API
 *
 * @param employeeData - Dados do funcionário (OPERADOR_NOME e OPERADOR_MATRICULA)
 * @returns Promise com array de registros de horas
 * @throws Error se a requisição falhar
 */
export async function fetchEmployeeHours(
  employeeData: FetchEmployeeHoursPayload
): Promise<EmployeeHoursRecord[]> {
  const apiUrl = process.env.NEXT_PUBLIC_BUSCAR_HOURS_FUNCIONARIO_ENV;

  if (!apiUrl) {
    throw new Error(
      "URL da API não configurada. Verifique a variável NEXT_PUBLIC_BUSCAR_HOURS_FUNCIONARIO_ENV"
    );
  }

  console.log("Buscando horas do funcionário:", {
    url: apiUrl,
    payload: employeeData,
  });

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }

    // Verifica se há conteúdo na resposta
    const text = await response.text();
    if (!text || text.trim() === "") {
      console.log("Resposta vazia da API - nenhum registro encontrado");
      return [];
    }

    try {
      const data: EmployeeHoursRecord[] = JSON.parse(text);
      console.log(`${data.length} registro(s) de horas encontrado(s)`);
      return Array.isArray(data) ? data : [];
    } catch (parseError) {
      console.error("Erro ao parsear JSON:", parseError);
      throw new Error("Resposta inválida da API. Tente novamente.");
    }
  } catch (error) {
    console.error("Erro ao buscar horas do funcionário:", error);

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        "Erro de conexão. Verifique sua internet e tente novamente."
      );
    }

    throw error;
  }
}
