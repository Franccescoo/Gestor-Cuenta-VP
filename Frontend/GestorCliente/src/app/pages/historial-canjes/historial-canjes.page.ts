import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HistorialCanjeDetalle } from 'src/app/models/HistorialCanjeDetalle.model';
import { HistorialCanjeService } from 'src/app/Service/HistorialCanjeService.service';
import { DashboardService } from 'src/app/Service/DashboardService.service';

@Component({
  selector: 'app-historial-canjes',
  templateUrl: './historial-canjes.page.html',
  styleUrls: ['./historial-canjes.page.scss'],
})
export class HistorialCanjesPage implements OnInit {
  // sesión
  playerId!: string;
  sistemaId!: number;

  // estado UI
  cargando = true;

  // data
  historial: HistorialCanjeDetalle[] = [];
  historialFiltrado: HistorialCanjeDetalle[] = [];

  // filtros
  filtroTipo: 'todos' | 'beneficios' | 'productos' = 'todos';
  ordenFecha: 'asc' | 'desc' = 'desc';

  constructor(
    private historialService: HistorialCanjeService,
    private dash: DashboardService,
    private toast: ToastController
  ) {}

  ngOnInit(): void {
    // Obtiene playerId/sistemaId desde el token (como en otras páginas)
    this.dash.getMeTokenData().subscribe({
      next: ids => {
        this.playerId = ids.playerId;
        this.sistemaId = ids.sistemaId;
        this.cargar();
      },
      error: async () => {
        this.cargando = false;
        (await this.toast.create({
          message: 'No pude leer tu sesión',
          duration: 2200,
          color: 'danger'
        })).present();
      }
    });
  }

  private cargar(): void {
    this.cargando = true;
    this.historialService.getHistorialDetalle(this.playerId, this.sistemaId).subscribe({
      next: (data) => {
        this.historial = Array.isArray(data) ? data : [];
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: async () => {
        this.cargando = false;
        (await this.toast.create({
          message: 'No se pudo cargar el historial de canjes',
          duration: 2200,
          color: 'danger'
        })).present();
      }
    });
  }

  // Eventos de los ion-segment (si los agregas en el HTML con (ionChange))
  onFiltroChange(): void { this.aplicarFiltros(); }
  onOrdenChange(): void { this.aplicarFiltros(); }

  aplicarFiltros(): void {
    let datos = [...this.historial];

    // filtra por tipo (si más adelante agregas productos reales, ajusta esProducto)
    if (this.filtroTipo === 'beneficios') {
      datos = datos.filter(x => !this.esProducto(x));
    } else if (this.filtroTipo === 'productos') {
      datos = datos.filter(x => this.esProducto(x));
    }

    // orden por fecha
    datos.sort((a, b) => {
      const fa = new Date(a.fechaCanje as any).getTime();
      const fb = new Date(b.fechaCanje as any).getTime();
      return this.ordenFecha === 'desc' ? fb - fa : fa - fb;
    });

    this.historialFiltrado = datos;
  }

  // ===== Helpers para el icono/clase usados en el template =====
  esProducto(i: HistorialCanjeDetalle): boolean {
    // Si tu DTO aún NO trae productos, deja false.
    // Cuando tengas productos, cambia por: return !!(i as any).producto && !(i as any).beneficio;
    return false;
  }

  iconClass(i: HistorialCanjeDetalle): 'prod' | 'bene' {
    return this.esProducto(i) ? 'prod' : 'bene';
  }

  iconName(i: HistorialCanjeDetalle): string {
    return this.esProducto(i) ? 'bag-handle-outline' : 'sparkles-outline';
  }

  // Botón "Detalle" (stub)
  async verDetalle(item: HistorialCanjeDetalle): Promise<void> {
    (await this.toast.create({
      message: `Detalle: ${item?.beneficio?.nombre ?? '—'}`,
      duration: 1500,
      color: 'medium'
    })).present();
  }

  // Optimiza *ngFor
  trackById(_i: number, item: HistorialCanjeDetalle): any {
    return (item as any).id ?? `${item?.beneficio?.id ?? ''}-${item?.fechaCanje ?? ''}`;
  }
}
