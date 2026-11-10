export type EstadoAuth = {
  error?: string;
  success?: string;
} | null;

export type Ciudad = {
  id_ciudad: number;
  nombre: string;
  departamento: string;
};
