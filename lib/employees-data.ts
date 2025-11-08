export interface Employee {
  id: string
  name: string
  matricula: string
  dataNascimento: string
  createdAt: string
}

export const getEmployees = (): Employee[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("employees")
  return data ? JSON.parse(data) : []
}

export const saveEmployees = (employees: Employee[]): void => {
  localStorage.setItem("employees", JSON.stringify(employees))
}

export const addEmployee = (employee: Omit<Employee, "id" | "createdAt">): Employee => {
  const newEmployee: Employee = {
    ...employee,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  const employees = getEmployees()
  employees.push(newEmployee)
  saveEmployees(employees)
  return newEmployee
}

export const deleteEmployee = (id: string): void => {
  const employees = getEmployees().filter((e) => e.id !== id)
  saveEmployees(employees)
}

export const updateEmployee = (id: string, employee: Omit<Employee, "id" | "createdAt">): void => {
  const employees = getEmployees().map((e) => (e.id === id ? { ...e, ...employee } : e))
  saveEmployees(employees)
}
