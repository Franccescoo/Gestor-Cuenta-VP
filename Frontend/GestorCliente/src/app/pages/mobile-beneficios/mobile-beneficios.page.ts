import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { MobileAuthService } from 'src/app/Service/mobile-auth.service';
import { MobileBeneficiosService, BeneficioCanjeado } from 'src/app/Service/mobile-beneficios.service';

@Component({
  selector: 'app-mobile-beneficios',
  templateUrl: './mobile-beneficios.page.html',
  styleUrls: ['./mobile-beneficios.page.scss'],
})
export class MobileBeneficiosPage implements OnInit {
  beneficios: BeneficioCanjeado[] = [];
  user: any = null;
  segmentoActivo = 'canjeados';
  cargando = true;

  constructor(
    private authService: MobileAuthService,
    private beneficiosService: MobileBeneficiosService,
    private router: Router,
    private toast: ToastController,
    private loading: LoadingController,
    private alert: AlertController
  ) {}

  ngOnInit() {
    this.verificarAutenticacion();
  }

  ionViewWillEnter() {
    this.verificarAutenticacion();
  }

  async verificarAutenticacion() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/mobile-login']);
      return;
    }

    this.user = this.authService.getCurrentUser();
    await this.cargarBeneficios();
  }

  async cargarBeneficios() {
    this.cargando = true;
    
    try {
      if (this.segmentoActivo === 'canjeados') {
        this.beneficios = await this.beneficiosService.getBeneficiosCanjeados().toPromise() || [];
      } else {
        this.beneficios = await this.beneficiosService.getBeneficiosDisponibles().toPromise() || [];
      }
    } catch (error) {
      console.error('Error al cargar beneficios:', error);
      const toast = await this.toast.create({
        message: 'Error al cargar los beneficios',
        duration: 3000,
        color: 'danger'
      });
      toast.present();
    } finally {
      this.cargando = false;
    }
  }

  async onSegmentChange(event: any) {
    this.segmentoActivo = event.detail.value;
    await this.cargarBeneficios();
  }

  async verDetalleBeneficio(beneficio: BeneficioCanjeado) {
    if (!this.beneficiosService.isBeneficioDisponible(beneficio)) {
      const alert = await this.alert.create({
        header: 'Beneficio no disponible',
        message: `Este beneficio estará disponible en ${beneficio.diasRestantes} días.`,
        buttons: ['OK']
      });
      alert.present();
      return;
    }

    // Navegar a la página de detalle
    this.router.navigate(['/mobile-detalle-beneficio', beneficio.beneficioId]);
  }

  async copiarCodigo(codigo: string) {
    // En un entorno real, usarías el Clipboard API
    const alert = await this.alert.create({
      header: 'Código de promoción',
      message: `Tu código es: ${codigo}`,
      buttons: [
        {
          text: 'Copiar',
          handler: () => {
            // Aquí implementarías la copia al portapapeles
            console.log('Código copiado:', codigo);
          }
        },
        'Cerrar'
      ]
    });
    alert.present();
  }

  async logout() {
    const alert = await this.alert.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar sesión',
          handler: () => {
            this.authService.logout();
            this.router.navigate(['/mobile-login']);
          }
        }
      ]
    });
    alert.present();
  }

  getEstadoBeneficio(beneficio: BeneficioCanjeado): string {
    return this.beneficiosService.getEstadoBeneficio(beneficio);
  }

  isBeneficioDisponible(beneficio: BeneficioCanjeado): boolean {
    return this.beneficiosService.isBeneficioDisponible(beneficio);
  }
}
