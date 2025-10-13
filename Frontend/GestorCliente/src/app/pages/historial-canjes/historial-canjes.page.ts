import { Component, OnInit } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';
import { HistorialCanjeDetalle } from 'src/app/models/HistorialCanjeDetalle.model';
import { HistorialCanjeService } from 'src/app/Service/HistorialCanjeService.service';
import { DashboardService } from 'src/app/Service/DashboardService.service';
import { DetalleCanjeModalComponent } from 'src/app/components/detalle-canje-modal/detalle-canje-modal.component';

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
    private toast: ToastController,
    private modalController: ModalController
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

  // ✅ Eventos de los filtros
  onFiltroChange(): void { 
    console.log('🔍 Filtro cambiado:', this.filtroTipo);
    this.aplicarFiltros(); 
  }
  
  onOrdenChange(): void { 
    console.log('📅 Orden cambiado:', this.ordenFecha);
    this.aplicarFiltros(); 
  }

  aplicarFiltros(): void {
    console.log('🔄 Aplicando filtros...', { 
      filtroTipo: this.filtroTipo, 
      ordenFecha: this.ordenFecha, 
      totalItems: this.historial.length 
    });

    let datos = [...this.historial];

    // ✅ Filtrar por tipo
    if (this.filtroTipo === 'beneficios') {
      datos = datos.filter(x => !this.esProducto(x));
      console.log('📊 Filtrado por beneficios:', datos.length, 'items');
    } else if (this.filtroTipo === 'productos') {
      datos = datos.filter(x => this.esProducto(x));
      console.log('📦 Filtrado por productos:', datos.length, 'items');
    } else {
      console.log('📋 Mostrando todos:', datos.length, 'items');
    }

    // ✅ Ordenar por fecha
    datos.sort((a, b) => {
      const fechaA = new Date(a.fechaCanje);
      const fechaB = new Date(b.fechaCanje);
      
      // Validar fechas
      if (isNaN(fechaA.getTime()) || isNaN(fechaB.getTime())) {
        console.warn('⚠️ Fecha inválida encontrada:', { a: a.fechaCanje, b: b.fechaCanje });
        return 0;
      }
      
      const timeA = fechaA.getTime();
      const timeB = fechaB.getTime();
      
      return this.ordenFecha === 'desc' ? timeB - timeA : timeA - timeB;
    });

    console.log('✅ Filtros aplicados:', datos.length, 'items finales');
    this.historialFiltrado = datos;
  }

  // ===== Helpers para el icono/clase usados en el template =====
  esProducto(i: HistorialCanjeDetalle): boolean {
    // ✅ Detectar si es producto o beneficio
    // Si tiene producto y no beneficio = producto
    // Si tiene beneficio = beneficio
    // Si no tiene ninguno = asumir beneficio por defecto
    
    const hasProducto = !!(i as any).producto;
    const hasBeneficio = !!(i as any).beneficio;
    
    if (hasProducto && !hasBeneficio) {
      return true; // Es producto
    } else if (hasBeneficio) {
      return false; // Es beneficio
    } else {
      return false; // Por defecto, asumir beneficio
    }
  }

  iconClass(i: HistorialCanjeDetalle): 'prod' | 'bene' {
    return this.esProducto(i) ? 'prod' : 'bene';
  }

  iconName(i: HistorialCanjeDetalle): string {
    // ✅ Iconos más descriptivos según el tipo
    if (this.esProducto(i)) {
      return 'bag-handle-outline'; // Icono de bolsa para productos
    } else {
      return 'gift-outline'; // Icono de regalo para beneficios
    }
  }

  // ✅ Modal de detalle del canje
  async verDetalle(item: HistorialCanjeDetalle): Promise<void> {
    const modal = await this.modalController.create({
      component: DetalleCanjeModalComponent,
      componentProps: {
        canje: item
      },
      cssClass: 'detalle-canje-modal',
      backdropDismiss: true
    });
    
    await modal.present();
  }

  // ✅ Estadísticas de filtros
  get estadisticasFiltros(): { total: number, beneficios: number, productos: number } {
    const total = this.historial.length;
    const beneficios = this.historial.filter(x => !this.esProducto(x)).length;
    const productos = this.historial.filter(x => this.esProducto(x)).length;
    
    return { total, beneficios, productos };
  }

  // ✅ Mensaje de estado de filtros
  get mensajeEstadoFiltros(): string {
    const { total, beneficios, productos } = this.estadisticasFiltros;
    
    if (this.filtroTipo === 'beneficios') {
      return `Mostrando ${beneficios} beneficio${beneficios !== 1 ? 's' : ''}`;
    } else if (this.filtroTipo === 'productos') {
      return `Mostrando ${productos} producto${productos !== 1 ? 's' : ''}`;
    } else {
      return `Mostrando ${total} elemento${total !== 1 ? 's' : ''} total`;
    }
  }

  // ✅ Optimiza *ngFor
  trackById(_i: number, item: HistorialCanjeDetalle): any {
    return (item as any).id ?? `${item?.beneficio?.id ?? ''}-${item?.fechaCanje ?? ''}`;
  }
}
