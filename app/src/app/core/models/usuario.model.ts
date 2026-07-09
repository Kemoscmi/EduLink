export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'TUTOR';
  telefono?: string;
  activo: boolean;
  createAt?: string;
  updateAt?: string;
}