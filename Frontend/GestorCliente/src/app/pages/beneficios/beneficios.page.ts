import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { DashboardService } from 'src/app/Service/DashboardService.service';
import { BeneficioDTO } from 'src/app/models/BeneficioDTO.model';

type TierId = 'silver' | 'gold' | 'black' | 'platinum' | 'diamond';

interface TierVM {
  id: TierId;
  name: string;
  class: string;
  items: BeneficioDTO[];
}

@Component({
  selector: 'app-beneficios',
  templateUrl: './beneficios.page.html',
  styleUrls: ['./beneficios.page.scss'],
})
export class BeneficiosPage implements OnInit {
  cargando = true;

  // UI orden fijo
  tiersVM: TierVM[] = [
    { id: 'silver',   name: 'Silver',   class: 'silver',   items: [] },
    { id: 'gold',     name: 'Gold',     class: 'gold',     items: [] },
    { id: 'black',    name: 'Black',    class: 'black',    items: [] },
    { id: 'platinum', name: 'Platinum', class: 'platinum', items: [] },
    { id: 'diamond',  name: 'Diamond',  class: 'diamond',  items: [] },
  ];

  constructor(
    private dash: DashboardService,
    private toast: ToastController
  ) {}

  async ngOnInit() {
    try {
      const ids = await this.dash.getMeTokenData().toPromise();
      const beneficios = await this.dash.getBeneficios(ids!.playerId, ids!.sistemaId).toPromise();

      // limpiar
      this.tiersVM.forEach(t => (t.items = []));

      // agrupar por nivel detectado
      (beneficios || []).forEach(b => {
        const tier = this.mapTierId(this.extractNivel(b));
        if (!tier) return; // si no calza con nuestros tiers, lo omitimos
        const bucket = this.tiersVM.find(t => t.id === tier)!;
        bucket.items.push(b);
      });
    } catch {
      (await this.toast.create({
        message: 'No se pudieron cargar los beneficios.',
        duration: 2200,
        color: 'danger',
      })).present();
    } finally {
      this.cargando = false;
    }
  }

  /* ==== Helpers de mapeo ==== */

  private norm(s: string) {
    return (s || '')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .trim();
  }

  /** Intenta obtener el nombre del nivel desde distintos posibles campos del DTO */
  private extractNivel(b: BeneficioDTO): string {
    const a = b as any;
    return (
      a.nivel ??
      a.nivelNombre ??
      a.categoria ??
      a.categoriaNombre ??
      a.tier ??
      a.tierNombre ??
      a.rango ??
      ''
    );
  }

  /** Mapea el nombre libre a uno de nuestros TierId */
  private mapTierId(nivel: string): TierId | undefined {
    const n = this.norm(nivel);
    if (/(^| )silver/.test(n)) return 'silver';
    if (/(^| )oro|gold/.test(n)) return 'gold';
    if (/(^| )black|negro/.test(n)) return 'black';
    if (/(^| )platino|platinum/.test(n)) return 'platinum';
    if (/(^| )diamond|diamante/.test(n)) return 'diamond';
    return undefined;
  }

  /** Título a mostrar por beneficio */
  titleOf(b: BeneficioDTO): string {
    const a = b as any;
    return a.titulo ?? a.nombre ?? a.name ?? a.beneficio ?? 'Beneficio';
  }

  /** Descripción (opcional) */
  descOf(b: BeneficioDTO): string {
    const a = b as any;
    return a.descripcion ?? a.detalle ?? a.description ?? '';
  }

  /* TrackBys */
  trById(_: number, t: TierVM) { return t.id; }
  trBenId(_: number, b: BeneficioDTO) { return (b as any).id ?? (b as any).beneficioId ?? JSON.stringify(b); }
}
