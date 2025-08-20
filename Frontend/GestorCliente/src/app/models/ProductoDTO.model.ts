export interface ProductoDTO {
  id: number;
  nombre: string;
  descripcion: string | null;
  puntosCanje: number | null;
  costo: number | null;
  moneda: string | null;
  foto1?: string | null;
  foto2?: string | null;
  foto3?: string | null;
  activo: boolean;

  sistema: {
    id: number;       // Integer en backend
    nombre: string;
  };

  categoria: {
    id: number;       // Integer
    nombre: string;
    descripcion: string | null;
    nivel: number | null;
    puntosInicio: number | null;
    puntosFinal: number | null;
  };
}
