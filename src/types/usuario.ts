export interface Comercio {
  id: number;
  nombre?: string;
  activo: boolean;
  llave_actual?: string | null;
  email_bancario?: string | null;
}

export interface Usuario {
  id: number;
  nombre?: string;
  email?: string;
  comercio?: Comercio;
  comercioId?: number;
}
