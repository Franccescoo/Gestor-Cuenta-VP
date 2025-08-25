import { Beneficio } from "./Beneficio.model";
import { Categoria } from "./Categoria.model";

export interface HistorialCanjeDetalle {
  id: number;
  playerId: string;
  sistemaId: number;
  estado: string;
  fechaCanje: string;
  fechaRespuesta: string | null;
  motivoRechazo: string | null;
  beneficio: Beneficio;
  categoria: Categoria;
}