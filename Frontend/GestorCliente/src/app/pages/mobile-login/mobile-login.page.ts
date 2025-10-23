import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { MobileAuthService, LoginRequest } from 'src/app/Service/mobile-auth.service';

@Component({
  selector: 'app-mobile-login',
  templateUrl: './mobile-login.page.html',
  styleUrls: ['./mobile-login.page.scss'],
})
export class MobileLoginPage implements OnInit {
  credentials: LoginRequest = {
    email: '',
    password: ''
  };

  constructor(
    private authService: MobileAuthService,
    private router: Router,
    private toast: ToastController,
    private loading: LoadingController
  ) {}

  ngOnInit() {
    // Si ya está autenticado, redirigir a beneficios
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/mobile-beneficios']);
    }
  }

  async onLogin() {
    if (!this.credentials.email || !this.credentials.password) {
      const toast = await this.toast.create({
        message: 'Por favor completa todos los campos',
        duration: 3000,
        color: 'warning'
      });
      toast.present();
      return;
    }

    const loading = await this.loading.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent'
    });
    await loading.present();

    this.authService.login(this.credentials).subscribe({
      next: async (response) => {
        await loading.dismiss();
        
        if (response.success) {
          const toast = await this.toast.create({
            message: '¡Bienvenido! Acceso exitoso',
            duration: 2000,
            color: 'success'
          });
          toast.present();
          
          // Redirigir a la página de beneficios
          this.router.navigate(['/mobile-beneficios']);
        } else {
          const toast = await this.toast.create({
            message: 'Error en las credenciales',
            duration: 3000,
            color: 'danger'
          });
          toast.present();
        }
      },
      error: async (error) => {
        await loading.dismiss();
        
        const toast = await this.toast.create({
          message: 'Error de conexión. Verifica tus credenciales',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
        
        console.error('Error de login:', error);
      }
    });
  }

  async onForgotPassword() {
    const toast = await this.toast.create({
      message: 'Contacta con soporte para recuperar tu contraseña',
      duration: 4000,
      color: 'info'
    });
    toast.present();
  }
}
