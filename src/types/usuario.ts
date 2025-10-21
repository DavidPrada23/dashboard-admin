export interface Comercio {
  id: number;
  nombre: string;
  activo: boolean;
  emailBancario: string;
  llaveActual: string;
}

export type Usuario = Comercio; // el endpoint /comercio/me devuelve directamente el comercio

