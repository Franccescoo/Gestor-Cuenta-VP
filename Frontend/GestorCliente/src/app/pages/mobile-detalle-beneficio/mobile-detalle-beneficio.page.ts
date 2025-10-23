import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { MobileAuthService } from 'src/app/Service/mobile-auth.service';
import { MobileBeneficiosService, DetalleBeneficioCanjeado } from 'src/app/Service/mobile-beneficios.service';

@Component({
  selector: 'app-mobile-detalle-beneficio',
  templateUrl: './mobile-detalle-beneficio.page.html',
  styleUrls: ['./mobile-detalle-beneficio.page.scss'],
})
export class MobileDetalleBeneficioPage implements OnInit {
  beneficio: DetalleBeneficioCanjeado | null = null;
  cargando = true;
  beneficioId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: MobileAuthService,
    private beneficiosService: MobileBeneficiosService,
    private toast: ToastController,
    private alert: AlertController
  ) {}

  ngOnInit() {
    this.verificarAutenticacion();
    this.route.params.subscribe(params => {
      this.beneficioId = +params['id'];
      this.cargarDetalleBeneficio();
    });
  }

  async verificarAutenticacion() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/mobile-login']);
      return;
    }
  }

  async cargarDetalleBeneficio() {
    this.cargando = true;
    
    try {
      this.beneficio = await this.beneficiosService.getDetalleBeneficio(this.beneficioId).toPromise();
    } catch (error) {
      console.error('Error al cargar detalle del beneficio:', error);
      const toast = await this.toast.create({
        message: 'Error al cargar el beneficio',
        duration: 3000,
        color: 'danger'
      });
      toast.present();
      this.router.navigate(['/mobile-beneficios']);
    } finally {
      this.cargando = false;
    }
  }

  async copiarCodigo() {
    if (!this.beneficio) return;

    const alert = await this.alert.create({
      header: 'Código de Promoción',
      message: `Tu código es: ${this.beneficio.codigoPromocion}`,
      buttons: [
        {
          text: 'Copiar',
          handler: () => {
            // Aquí implementarías la copia al portapapeles
            this.mostrarMensajeCopiado();
          }
        },
        'Cerrar'
      ]
    });
    alert.present();
  }

  async mostrarMensajeCopiado() {
    const toast = await this.toast.create({
      message: 'Código copiado al portapapeles',
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  async mostrarInstrucciones() {
    if (!this.beneficio) return;

    const alert = await this.alert.create({
      header: 'Instrucciones de Uso',
      message: this.beneficio.instruccionesUso,
      buttons: ['Entendido']
    });
    alert.present();
  }

  async mostrarTerminos() {
    if (!this.beneficio) return;

    const alert = await this.alert.create({
      header: 'Términos y Condiciones',
      message: this.beneficio.terminosCondiciones,
      buttons: ['Cerrar']
    });
    alert.present();
  }

  async contactarSoporte() {
    if (!this.beneficio) return;

    const alert = await this.alert.create({
      header: 'Contacto',
      message: this.beneficio.contacto,
      buttons: ['Cerrar']
    });
    alert.present();
  }

  isBeneficioDisponible(): boolean {
    return this.beneficio ? this.beneficio.diasRestantes <= 0 : false;
  }

  getEstadoBeneficio(): string {
    if (!this.beneficio) return '';
    
    if (this.beneficio.diasRestantes > 0) {
      return `Disponible en ${this.beneficio.diasRestantes} días`;
    } else {
      return 'Disponible ahora';
    }
  }
}
