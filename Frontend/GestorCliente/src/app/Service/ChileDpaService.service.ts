import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, map } from 'rxjs';

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

/** Estructuras del JSON local */
interface ChileJson {
  name: string;
  regions: Array<{
    name: string;
    romanNumber: string;
    number: string;   // lo usaremos como "codigo" de la región
    id: string;
    communes: Array<{ name: string; id: string }>;
  }>;
}

@Injectable({ providedIn: 'root' })
export class ChileDpaService {
  // Carga única del JSON local (cacheada)
  private data$ = this.http
    .get<ChileJson>('assets/APIS/chile-dpa.json')
    .pipe(shareReplay(1));

  constructor(private http: HttpClient) {}

  /** Regiones → DpaSector[] (codigo = number, nombre = name) */
  getRegiones(): Observable<DpaSector[]> {
    return this.data$.pipe(
      map(d =>
        d.regions.map(r => ({
          codigo: r.number,
          tipo: 'region' as const,
          nombre: r.name
        }))
      )
    );
  }

  /** Comunas por región (codRegion = number del JSON) */
  getComunasByRegion(codRegion: string): Observable<DpaSector[]> {
    return this.data$.pipe(
      map(d => d.regions.find(r => r.number === codRegion)),
      map(r =>
        r
          ? r.communes.map(c => ({
              codigo: c.id,                 // usamos el slug de comuna como código
              tipo: 'comuna' as const,
              nombre: c.name,
              codigo_padre: r.number
            }))
          : []
      )
    );
  }
}
