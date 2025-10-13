import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { CategoriaConBeneficios } from 'src/app/models/CategoriaConBeneficios.model';
import { RegistrarCanjeRequest } from 'src/app/models/RegistrarCanjeRequest.model';
import { CanjeService } from 'src/app/Service/CanjeService.service';
import { DashboardService } from 'src/app/Service/DashboardService.service';
import { UserDashboardDTO } from 'src/app/models/UserDashboardDTO.model';
import { HistorialCanjeService } from 'src/app/Service/HistorialCanjeService.service';
import { HistorialCanjeDetalle } from 'src/app/models/HistorialCanjeDetalle.model';

@Component({
  selector: 'app-beneficios',
  templateUrl: './beneficios.page.html',
  styleUrls: ['./beneficios.page.scss'],
})
export class BeneficiosPage implements OnInit {
  cargando = true;
  playerId!: string;
  sistemaId!: number;
  totalBeneficios = 0;
  categorias: CategoriaConBeneficios[] = [];
  nivelActual: string | null = null;
  nivelUsuario: string | null = null; // ✅ Nivel del usuario actual
  
  // ✅ Filtros de nivel
  nivelSeleccionado: number | null = null;
  categoriasFiltradas: CategoriaConBeneficios[] = [];
  categoriasDisponibles: CategoriaConBeneficios[] = []; // ✅ Solo niveles disponibles para el usuario
  
  // ✅ Historial de canjes
  historialCanjes: HistorialCanjeDetalle[] = [];
  beneficiosCanjeados: Map<number, HistorialCanjeDetalle> = new Map(); // beneficioId -> canje

  constructor(
    private dash: DashboardService,
    private toast: ToastController,
    private canjeService: CanjeService,
    private historialService: HistorialCanjeService
  ) {}

  ngOnInit(): void {
    this.dash.getMeTokenData().subscribe({
      next: ids => {
        this.playerId = ids.playerId;
        this.sistemaId = ids.sistemaId;
        this.cargarNivelUsuario(); // ✅ Primero obtener el nivel del usuario
      },
      error: async () => {
        this.cargando = false;
        (await this.toast.create({ message: 'No pude leer tu sesión', duration: 2200, color: 'danger'})).present();
      }
    });
  }

  // ✅ Obtener nivel del usuario
  private cargarNivelUsuario(): void {
    this.dash.getDashboard(this.playerId, this.sistemaId).subscribe({
      next: (dashboard: UserDashboardDTO) => {
        this.nivelUsuario = dashboard.nivel;
        console.log('🎯 Nivel del usuario:', this.nivelUsuario);
        this.cargarHistorialCanjes(); // Primero cargar historial
      },
      error: async () => {
        console.warn('⚠️ No se pudo obtener el nivel del usuario, mostrando todos los beneficios');
        this.nivelUsuario = null;
        this.cargarHistorialCanjes();
      }
    });
  }

  // ✅ Cargar historial de canjes
  private cargarHistorialCanjes(): void {
    this.historialService.getHistorialDetalle(this.playerId, this.sistemaId).subscribe({
      next: (historial) => {
        this.historialCanjes = historial;
        this.procesarBeneficiosCanjeados();
        console.log('📋 Historial de canjes cargado:', historial.length, 'canjes');
        this.cargar(); // Luego cargar beneficios
      },
      error: async () => {
        console.warn('⚠️ No se pudo cargar el historial de canjes');
        this.historialCanjes = [];
        this.beneficiosCanjeados.clear();
        this.cargar(); // Continuar sin historial
      }
    });
  }

  // ✅ Procesar beneficios canjeados
  private procesarBeneficiosCanjeados(): void {
    this.beneficiosCanjeados.clear();
    
    // Filtrar solo canjes aprobados y recientes (últimos 30 días por ejemplo)
    const canjesAprobados = this.historialCanjes.filter(canje => 
      canje.estado === 'APROBADO' && this.esCanjeReciente(canje.fechaCanje)
    );

    canjesAprobados.forEach(canje => {
      this.beneficiosCanjeados.set(canje.beneficio.id, canje);
    });

    console.log('🎯 Beneficios canjeados encontrados:', this.beneficiosCanjeados.size);
  }

  // ✅ Verificar si un canje es reciente (dentro del período de cooldown)
  private esCanjeReciente(fechaCanje: string): boolean {
    const fechaCanjeDate = new Date(fechaCanje);
    const ahora = new Date();
    const diferenciaDias = (ahora.getTime() - fechaCanjeDate.getTime()) / (1000 * 60 * 60 * 24);
    
    // Cooldown de 30 días (puedes ajustar este valor)
    return diferenciaDias <= 30;
  }

  private cargar(): void {
    this.cargando = true;
    this.dash.getBeneficiosCatalogo(this.playerId, this.sistemaId).subscribe({
      next: (res) => {
        this.categorias = (res?.categorias || []).sort((a,b) => a.nivel - b.nivel);
        this.totalBeneficios = res?.totalBeneficios || 0;
        
        // ✅ Mostrar todas las categorías con información de disponibilidad
        this.categoriasDisponibles = this.filtrarCategoriasPorNivel(this.categorias);
        this.categoriasFiltradas = [...this.categoriasDisponibles]; // Mostrar todas por defecto
        
        console.log('📊 Categorías totales:', this.categorias.length);
        console.log('🎯 Categorías disponibles para el usuario:', this.categoriasDisponibles.length);
        console.log('👤 Nivel del usuario:', this.nivelUsuario);
        
        this.cargando = false;
      },
      error: async () => {
        this.cargando = false;
        (await this.toast.create({ message: 'No se pudo cargar el catálogo de beneficios', duration: 2200, color: 'danger'})).present();
      }
    });
  }

  // ✅ Mostrar todas las categorías pero marcar disponibilidad según nivel del usuario
  private filtrarCategoriasPorNivel(categorias: CategoriaConBeneficios[]): CategoriaConBeneficios[] {
    console.log('🔍 Mostrando todas las categorías con restricciones de nivel');
    
    if (!this.nivelUsuario) {
      console.log('⚠️ Sin nivel de usuario, mostrando todas las categorías como disponibles');
      return categorias; // Si no hay nivel, mostrar todas como disponibles
    }

    const nivelUsuarioLower = this.nivelUsuario.toLowerCase();
    console.log('🎯 Nivel del usuario:', nivelUsuarioLower);

    // Mapeo de niveles a números para comparación
    const nivelMap: { [key: string]: number } = {
      'silver': 1,
      'gold': 2,
      'black': 3,
      'platinum': 4,
      'diamond': 5
    };

    const nivelUsuarioNum = nivelMap[nivelUsuarioLower];
    
    if (!nivelUsuarioNum) {
      console.log('⚠️ Nivel de usuario no reconocido:', this.nivelUsuario);
      return categorias; // Si no reconoce el nivel, mostrar todas como disponibles
    }

    // ✅ Mostrar TODAS las categorías pero agregar información de disponibilidad
    const categoriasConDisponibilidad = categorias.map(cat => {
      const puedeAcceder = cat.nivel <= nivelUsuarioNum;
      console.log(`📋 Categoría ${cat.nombre} (nivel ${cat.nivel}): ${puedeAcceder ? '✅ Disponible' : '❌ No disponible'}`);
      
      // Agregar información de disponibilidad a cada categoría
      return {
        ...cat,
        disponible: puedeAcceder,
        nivelUsuario: nivelUsuarioNum
      } as any;
    });

    return categoriasConDisponibilidad;
  }

  // ✅ Filtrar por nivel (mostrar todos los niveles)
  filtrarPorNivel(categoriaId: number): void {
    if (this.nivelSeleccionado === categoriaId) {
      // Si ya está seleccionado, mostrar todos
      this.nivelSeleccionado = null;
      this.categoriasFiltradas = [...this.categoriasDisponibles];
    } else {
      // Filtrar por nivel seleccionado
      this.nivelSeleccionado = categoriaId;
      this.categoriasFiltradas = this.categoriasDisponibles.filter(cat => cat.id === categoriaId);
    }
  }

  // ✅ Obtener descripción del nivel
  getNivelDescription(nivelNombre: string): string {
    const descripciones: { [key: string]: string } = {
      'SILVER': 'Nivel Silver: desde 1 hasta 999 puntos. Beneficios base del club.',
      'GOLD': 'Nivel Gold: desde 1000 hasta 1999 puntos. Beneficios premium.',
      'BLACK': 'Nivel Black: desde 2000 hasta 4999 puntos. Beneficios exclusivos.',
      'PLATINUM': 'Nivel Platinum: desde 5000 hasta 9999 puntos. Beneficios VIP.',
      'DIAMOND': 'Nivel Diamond: desde 10000+ puntos. Beneficios premium máximos.'
    };
    
    return descripciones[nivelNombre.toUpperCase()] || 'Beneficios del nivel ' + nivelNombre;
  }

  // ✅ Obtener número del nivel del usuario para comparaciones
  getNivelUsuarioNum(): number {
    if (!this.nivelUsuario) return 0;
    
    const nivelMap: { [key: string]: number } = {
      'silver': 1,
      'gold': 2,
      'black': 3,
      'platinum': 4,
      'diamond': 5
    };
    
    return nivelMap[this.nivelUsuario.toLowerCase()] || 0;
  }

  // ✅ Verificar si un beneficio fue canjeado recientemente
  esBeneficioCanjeado(beneficioId: number): boolean {
    return this.beneficiosCanjeados.has(beneficioId);
  }

  // ✅ Obtener el estado de un beneficio
  getEstadoBeneficio(beneficioId: number, categoriaNivel: number): string {
    // Si el nivel es superior al del usuario, no está disponible
    if (categoriaNivel > this.getNivelUsuarioNum()) {
      return 'NO_DISPONIBLE';
    }
    
    // Si fue canjeado recientemente, está en cooldown
    if (this.esBeneficioCanjeado(beneficioId)) {
      return 'CANJEADO';
    }
    
    // Si está disponible para canjear
    return 'DISPONIBLE';
  }

  // ✅ Obtener información del canje para un beneficio
  getInfoCanje(beneficioId: number): HistorialCanjeDetalle | null {
    return this.beneficiosCanjeados.get(beneficioId) || null;
  }

  // ✅ Calcular días restantes para poder canjear de nuevo
  getDiasRestantesCooldown(beneficioId: number): number {
    const canje = this.getInfoCanje(beneficioId);
    if (!canje) return 0;
    
    const fechaCanjeDate = new Date(canje.fechaCanje);
    const ahora = new Date();
    const diferenciaDias = (ahora.getTime() - fechaCanjeDate.getTime()) / (1000 * 60 * 60 * 24);
    
    return Math.max(0, 30 - Math.floor(diferenciaDias)); // 30 días de cooldown
  }

  // 🔹 Nuevo método para canjear
  async onCanjear(catId: number, benId: number) {
    // ✅ Verificar si el beneficio ya fue canjeado
    if (this.esBeneficioCanjeado(benId)) {
      const diasRestantes = this.getDiasRestantesCooldown(benId);
      (await this.toast.create({ 
        message: `Este beneficio ya fue canjeado. Podrás canjearlo de nuevo en ${diasRestantes} días.`, 
        duration: 3000, 
        color: 'warning'
      })).present();
      return;
    }

    const payload: RegistrarCanjeRequest = {
      playerId: this.playerId,
      sistemaId: this.sistemaId,
      beneficioId: benId,
      categoriaId: catId
    };

    this.canjeService.solicitarCanje(payload).subscribe({
      next: async () => {
        (await this.toast.create({ message: 'Solicitud de canje enviada ✅', duration: 2000, color: 'success'})).present();
        // Recargar historial después del canje
        this.cargarHistorialCanjes();
      },
      error: async (err: any) => {
        const msg = err?.error?.message || 'No se pudo solicitar el canje';
        (await this.toast.create({ message: msg, duration: 2500, color: 'danger'})).present();
      }
    });
  }

  // class de estilo según nivel
  tierClass(cat: CategoriaConBeneficios): string {
    switch (cat.nivel) {
      case 1: return 'tier-silver';
      case 2: return 'tier-gold';
      case 3: return 'tier-black';
      case 4: return 'tier-platinum';
      case 5: return 'tier-diamond';
      default: return 'tier-silver';
    }
  }
}
