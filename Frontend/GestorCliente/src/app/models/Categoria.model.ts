export interface Categoria {
  id: number;
  sistemaId: number;
  nombre: string;
  descripcion: string;
  nivel: number;
  puntosInicio: number;
  puntosFinal: number;
  activo: boolean;
}