export type DpaTipo = 'region' | 'provincia' | 'comuna';

export interface DpaSector {
  codigo: string;
  tipo: DpaTipo;
  nombre: string;
  lat?: string;
  lng?: string;
  url?: string;
  codigo_padre?: string;
}
