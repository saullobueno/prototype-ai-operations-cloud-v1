import type { Employee } from "@/types";
import { daysAgo, monthsAgo } from "@/lib/time";

// ~35 colaboradores cobrindo os 9 departamentos e todos os EmploymentStatus — escala suficiente
// para uma diretoria realista sem precisar de 384 registros literais (ver docs/AI_OPERATIONS_CLOUD_COMPLETE_SPEC.md §25).
export const employees: Employee[] = [
  // ---------- Liderança ----------
  { id: "emp_001", name: "Bianca Ferreira", email: "bianca.ferreira@acmecloud.com", title: "CEO", departmentId: "dept_leadership", status: "active", startDate: monthsAgo(60), location: "Lisboa, PT" },
  { id: "emp_002", name: "Marcelo Duarte", email: "marcelo.duarte@acmecloud.com", title: "COO", departmentId: "dept_leadership", managerId: "emp_001", status: "active", startDate: monthsAgo(48), location: "Lisboa, PT" },

  // ---------- Engenharia ----------
  { id: "emp_003", name: "Carlos Mendes", email: "carlos.mendes@acmecloud.com", title: "VP of Engineering", departmentId: "dept_engineering", managerId: "emp_001", status: "active", startDate: monthsAgo(40), location: "Porto, PT" },
  { id: "emp_004", name: "Felipe Rocha", email: "felipe.rocha@acmecloud.com", title: "Engineering Manager", departmentId: "dept_engineering", managerId: "emp_003", status: "active", startDate: monthsAgo(30), location: "Porto, PT" },
  { id: "emp_005", name: "Marina Costa", email: "marina.costa@acmecloud.com", title: "Software Engineer", departmentId: "dept_engineering", managerId: "emp_004", status: "onboarding", startDate: daysAgo(9), location: "Remoto — PT" },
  { id: "emp_006", name: "Diego Almeida", email: "diego.almeida@acmecloud.com", title: "Senior Software Engineer", departmentId: "dept_engineering", managerId: "emp_004", status: "active", startDate: monthsAgo(20), location: "Porto, PT" },
  { id: "emp_007", name: "Aline Barros", email: "aline.barros@acmecloud.com", title: "Software Engineer", departmentId: "dept_engineering", managerId: "emp_004", status: "active", startDate: monthsAgo(14), location: "Remoto — BR" },
  { id: "emp_008", name: "Thiago Nogueira", email: "thiago.nogueira@acmecloud.com", title: "QA Engineer", departmentId: "dept_engineering", managerId: "emp_004", status: "active", startDate: monthsAgo(11), location: "Porto, PT" },
  { id: "emp_009", name: "Camila Duarte", email: "camila.duarte@acmecloud.com", title: "DevOps Engineer", departmentId: "dept_engineering", managerId: "emp_004", status: "active", startDate: monthsAgo(9), location: "Remoto — PT" },
  { id: "emp_010", name: "Bruno Lacerda", email: "bruno.lacerda@acmecloud.com", title: "Software Engineer", departmentId: "dept_engineering", managerId: "emp_004", status: "on_leave", startDate: monthsAgo(18), location: "Porto, PT" },
  { id: "emp_035", name: "Vinícius Prado", email: "vinicius.prado@acmecloud.com", title: "Software Engineer", departmentId: "dept_engineering", managerId: "emp_004", status: "terminated", startDate: monthsAgo(26), location: "Porto, PT" },

  // ---------- Produto ----------
  { id: "emp_011", name: "Patrícia Vale", email: "patricia.vale@acmecloud.com", title: "Head of Product", departmentId: "dept_product", managerId: "emp_001", status: "active", startDate: monthsAgo(36), location: "Lisboa, PT" },
  { id: "emp_012", name: "André Salgado", email: "andre.salgado@acmecloud.com", title: "Product Manager", departmentId: "dept_product", managerId: "emp_011", status: "active", startDate: monthsAgo(15), location: "Lisboa, PT" },
  { id: "emp_013", name: "Larissa Freitas", email: "larissa.freitas@acmecloud.com", title: "Product Analyst", departmentId: "dept_product", managerId: "emp_011", status: "active", startDate: monthsAgo(6), location: "Remoto — BR" },

  // ---------- Design ----------
  { id: "emp_014", name: "Rodrigo Nunes", email: "rodrigo.nunes@acmecloud.com", title: "Design Lead", departmentId: "dept_design", managerId: "emp_011", status: "active", startDate: monthsAgo(22), location: "Lisboa, PT" },
  { id: "emp_015", name: "Vanessa Melo", email: "vanessa.melo@acmecloud.com", title: "Product Designer", departmentId: "dept_design", managerId: "emp_014", status: "active", startDate: monthsAgo(8), location: "Remoto — PT" },

  // ---------- Vendas ----------
  { id: "emp_016", name: "Renato Cardoso", email: "renato.cardoso@acmecloud.com", title: "Head of Sales", departmentId: "dept_sales", managerId: "emp_002", status: "active", startDate: monthsAgo(34), location: "Lisboa, PT" },
  { id: "emp_017", name: "Rafael Souza", email: "rafael.souza@acmecloud.com", title: "Account Executive", departmentId: "dept_sales", managerId: "emp_016", status: "active", startDate: monthsAgo(24), location: "Lisboa, PT" },
  { id: "emp_018", name: "Débora Martins", email: "debora.martins@acmecloud.com", title: "Account Executive", departmentId: "dept_sales", managerId: "emp_016", status: "active", startDate: monthsAgo(16), location: "Remoto — PT" },
  { id: "emp_019", name: "Gustavo Pires", email: "gustavo.pires@acmecloud.com", title: "SDR", departmentId: "dept_sales", managerId: "emp_016", status: "active", startDate: monthsAgo(5), location: "Lisboa, PT" },
  { id: "emp_020", name: "Fernanda Lopes", email: "fernanda.lopes@acmecloud.com", title: "Sales Ops Analyst", departmentId: "dept_sales", managerId: "emp_016", status: "active", startDate: monthsAgo(3), location: "Lisboa, PT" },

  // ---------- Sucesso do Cliente ----------
  { id: "emp_021", name: "Juliana Prado", email: "juliana.prado@acmecloud.com", title: "CS Manager", departmentId: "dept_cs", managerId: "emp_002", status: "active", startDate: monthsAgo(28), location: "Porto, PT" },
  { id: "emp_022", name: "Otávio Ramos", email: "otavio.ramos@acmecloud.com", title: "CS Specialist", departmentId: "dept_cs", managerId: "emp_021", status: "active", startDate: monthsAgo(13), location: "Porto, PT" },
  { id: "emp_023", name: "Beatriz Nascimento", email: "beatriz.nascimento@acmecloud.com", title: "CS Specialist", departmentId: "dept_cs", managerId: "emp_021", status: "active", startDate: monthsAgo(7), location: "Remoto — BR" },
  { id: "emp_024", name: "Lucas Tavares", email: "lucas.tavares@acmecloud.com", title: "Support Engineer", departmentId: "dept_cs", managerId: "emp_021", status: "active", startDate: monthsAgo(4), location: "Porto, PT" },

  // ---------- Marketing ----------
  { id: "emp_025", name: "Priscila Gomes", email: "priscila.gomes@acmecloud.com", title: "Head of Marketing", departmentId: "dept_marketing", managerId: "emp_001", status: "active", startDate: monthsAgo(26), location: "Lisboa, PT" },
  { id: "emp_026", name: "Henrique Bastos", email: "henrique.bastos@acmecloud.com", title: "Content Marketing Manager", departmentId: "dept_marketing", managerId: "emp_025", status: "active", startDate: monthsAgo(12), location: "Remoto — PT" },
  { id: "emp_027", name: "Isabela Rezende", email: "isabela.rezende@acmecloud.com", title: "Growth Marketing Analyst", departmentId: "dept_marketing", managerId: "emp_025", status: "onboarding", startDate: daysAgo(3), location: "Remoto — BR" },

  // ---------- People & Talent ----------
  { id: "emp_028", name: "Sandra Vieira", email: "sandra.vieira@acmecloud.com", title: "Head of People", departmentId: "dept_people", managerId: "emp_002", status: "active", startDate: monthsAgo(31), location: "Lisboa, PT" },
  { id: "emp_029", name: "Eduardo Farias", email: "eduardo.farias@acmecloud.com", title: "People Ops Analyst", departmentId: "dept_people", managerId: "emp_028", status: "active", startDate: monthsAgo(9), location: "Lisboa, PT" },
  { id: "emp_030", name: "Natália Cunha", email: "natalia.cunha@acmecloud.com", title: "Talent Acquisition Partner", departmentId: "dept_people", managerId: "emp_028", status: "active", startDate: monthsAgo(6), location: "Lisboa, PT" },

  // ---------- Finanças & Operações ----------
  { id: "emp_031", name: "Roberto Diniz", email: "roberto.diniz@acmecloud.com", title: "Head of Finance", departmentId: "dept_finance", managerId: "emp_002", status: "active", startDate: monthsAgo(29), location: "Lisboa, PT" },
  { id: "emp_032", name: "Cristina Alves", email: "cristina.alves@acmecloud.com", title: "Financial Analyst", departmentId: "dept_finance", managerId: "emp_031", status: "active", startDate: monthsAgo(10), location: "Lisboa, PT" },
  { id: "emp_033", name: "Marcos Vieira", email: "marcos.vieira@acmecloud.com", title: "Operations Analyst", departmentId: "dept_finance", managerId: "emp_031", status: "offboarding", startDate: monthsAgo(17), location: "Lisboa, PT" },
  { id: "emp_034", name: "Tatiane Borges", email: "tatiane.borges@acmecloud.com", title: "Payroll Specialist", departmentId: "dept_finance", managerId: "emp_031", status: "active", startDate: monthsAgo(5), location: "Remoto — PT" },
];

export function getEmployeeById(id: string) {
  return employees.find((e) => e.id === id);
}

export function getEmployeesByDepartment(departmentId: string) {
  return employees.filter((e) => e.departmentId === departmentId);
}

export function getEmployeesByManager(managerId: string) {
  return employees.filter((e) => e.managerId === managerId);
}

export function getActiveHeadcount() {
  return employees.filter((e) => e.status !== "terminated").length;
}

export function addEmployee(employee: Employee) {
  employees.push(employee);
}

export function updateEmployee(id: string, patch: Partial<Employee>): Employee | undefined {
  const employee = employees.find((e) => e.id === id);
  if (!employee) return undefined;
  Object.assign(employee, patch);
  return employee;
}
