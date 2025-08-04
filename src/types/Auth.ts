export interface AuthRequest {
    correo: string;
    clave: string;
  }
  
export interface AuthResponse {
    token: string;
    usuario: {
        id: number;
        nombre: string;
    };
  }
  