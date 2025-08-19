import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { CategoriaConBeneficios } from 'src/app/models/CategoriaConBeneficios.model';
import { DashboardService } from 'src/app/Service/DashboardService.service';

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
  constructor(
    private dash: DashboardService,
    private toast: ToastController,
  ) {}

  ngOnInit(): void {
    this.dash.getMeTokenData().subscribe({
      next: ids => {
        this.playerId = ids.playerId;
        this.sistemaId = ids.sistemaId;
        this.cargar();
      },
      error: async () => {
        this.cargando = false;
        (await this.toast.create({ message: 'No pude leer tu sesión', duration: 2200, color: 'danger'})).present();
      }
    });
  }

  private cargar(): void {
    this.cargando = true;
    this.dash.getBeneficiosCatalogo(this.playerId, this.sistemaId).subscribe({
      next: (res) => {
        this.categorias = (res?.categorias || []).sort((a,b) => a.nivel - b.nivel);
        this.totalBeneficios = res?.totalBeneficios || 0;
        this.cargando = false;
      },
      error: async () => {
        this.cargando = false;
        (await this.toast.create({ message: 'No se pudo cargar el catálogo de beneficios', duration: 2200, color: 'danger'})).present();
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
