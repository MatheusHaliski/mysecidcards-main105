export type EmployeeRaw = {
  id: string;
  cargo?: string;
  celular?: string;
  displayName?: string;
  email?: string;
  favorito?: boolean;
  funcao?: string;
  nome?: string;
  projetos?: string | string[];
  project?: string | string[];
  projects?: string | string[];
  projeto?: string | string[];
  ramal?: string;
  regional?: string;
  uuid?: string;
};

export type NormalizedEmployee = EmployeeRaw & {
  name: string;
  cargoNormalized: string;
  funcaoNormalized: string;
  regionalNormalized: string;
  emailNormalized: string;
  celularNormalized: string;
  ramalNormalized: string;
  projectsNormalized: string[];
  favorite: boolean;
};

function safeStr(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeProjects(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => safeStr(item)).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[\n,;|]+/g)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export function normalizeEmployee(employee: EmployeeRaw): NormalizedEmployee {
  const name =
    safeStr(employee.nome) ||
    safeStr(employee.displayName) ||
    safeStr(employee.email);

  const projects = [
    ...normalizeProjects(employee.projetos),
    ...normalizeProjects(employee.projects),
    ...normalizeProjects(employee.project),
    ...normalizeProjects(employee.projeto),
  ];

  return {
    ...employee,
    name,
    cargoNormalized: safeStr(employee.cargo),
    funcaoNormalized: safeStr(employee.funcao),
    regionalNormalized: safeStr(employee.regional),
    emailNormalized: safeStr(employee.email),
    celularNormalized: safeStr(employee.celular),
    ramalNormalized: safeStr(employee.ramal),
    projectsNormalized: Array.from(new Set(projects)),
    favorite: Boolean(employee.favorito),
  };
}
