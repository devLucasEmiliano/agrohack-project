export interface TimesheetEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  startTime: string;
  endTime: string;
  hoursWorked: number;
  activity: string;
  location: string;
  notes?: string;
  createdAt: string;
}

export const getTimesheetEntries = (): TimesheetEntry[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("timesheet_entries");
  return data ? JSON.parse(data) : [];
};

export const saveTimesheetEntries = (entries: TimesheetEntry[]): void => {
  localStorage.setItem("timesheet_entries", JSON.stringify(entries));
};

export const addTimesheetEntry = (
  entry: Omit<TimesheetEntry, "id" | "createdAt">
): TimesheetEntry => {
  const newEntry: TimesheetEntry = {
    ...entry,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  const entries = getTimesheetEntries();
  entries.push(newEntry);
  saveTimesheetEntries(entries);
  return newEntry;
};

export const deleteTimesheetEntry = (id: string): void => {
  const entries = getTimesheetEntries().filter((e) => e.id !== id);
  saveTimesheetEntries(entries);
};

export const getTimesheetByEmployee = (
  employeeId: string
): TimesheetEntry[] => {
  return getTimesheetEntries().filter((e) => e.employeeId === employeeId);
};

export const getTimesheetByDateRange = (
  startDate: string,
  endDate: string
): TimesheetEntry[] => {
  return getTimesheetEntries().filter((e) => {
    const entryDate = new Date(e.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return entryDate >= start && entryDate <= end;
  });
};

export const calculateStatistics = () => {
  const entries = getTimesheetEntries();

  if (entries.length === 0) {
    return {
      totalHours: 0,
      totalEntries: 0,
      avgHoursPerDay: 0,
      currentWeekHours: 0,
      currentMonthHours: 0,
      activeEmployees: 0,
    };
  }

  const totalHours = entries.reduce((sum, entry) => sum + entry.hoursWorked, 0);
  const totalEntries = entries.length;

  // Calcular média de horas por dia
  const uniqueDates = new Set(entries.map((e) => e.date));
  const avgHoursPerDay = totalHours / uniqueDates.size;

  // Horas da semana atual
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const currentWeekHours = entries
    .filter((e) => new Date(e.date) >= startOfWeek)
    .reduce((sum, entry) => sum + entry.hoursWorked, 0);

  // Horas do mês atual
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const currentMonthHours = entries
    .filter((e) => new Date(e.date) >= startOfMonth)
    .reduce((sum, entry) => sum + entry.hoursWorked, 0);

  // Funcionários ativos (com registros nos últimos 7 dias)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const activeEmployees = new Set(
    entries
      .filter((e) => new Date(e.date) >= sevenDaysAgo)
      .map((e) => e.employeeId)
  ).size;

  return {
    totalHours: Math.round(totalHours * 10) / 10,
    totalEntries,
    avgHoursPerDay: Math.round(avgHoursPerDay * 10) / 10,
    currentWeekHours: Math.round(currentWeekHours * 10) / 10,
    currentMonthHours: Math.round(currentMonthHours * 10) / 10,
    activeEmployees,
  };
};
