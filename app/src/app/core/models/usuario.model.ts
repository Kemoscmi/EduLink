export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  role: 'ADMIN' | 'CLIENTE' | 'PROFESIONAL';
  telefono?: string;
  activo: boolean;
  createAt?: string;
  updateAt?: string;
}