import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { SolicitudCambioPerfilService } from '../../Service/solicitud-cambio-perfil.service';
import { UserService } from '../../Service/user.service';
import { AuthService } from '../../Service/auth.service';
import { CAMPOS_AMIGABLES, CrearSolicitudRequest } from '../../models/SolicitudCambioPerfil.model';

@Component({
  selector: 'app-solicitar-cambio-perfil',
  templateUrl: './solicitar-cambio-perfil.page.html',
  styleUrls: ['./solicitar-cambio-perfil.page.scss'],
})
export class SolicitarCambioPerfilPage implements OnInit {
  solicitudForm: FormGroup;
  perfil: any;
  camposAmigables = CAMPOS_AMIGABLES;
  isLoading = false;

  // Campos editables según los requerimientos
  camposEditables = [
    { key: 'nombreCompleto', label: 'Nombre', type: 'text' },
    { key: 'apellidoCompleto', label: 'Apellido', type: 'text' },
    { key: 'fechaNacimiento', label: 'Fecha de Nacimiento', type: 'date' },
    { key: 'celular', label: 'Celular', type: 'tel' },
    { key: 'numeroDocumento', label: 'Número de Documento', type: 'text' },
    { key: 'calle', label: 'Calle', type: 'text' },
    { key: 'numero', label: 'Número', type: 'text' },
    { key: 'comuna', label: 'Comuna', type: 'text' },
    { key: 'region', label: 'Región', type: 'text' },
    { key: 'pais', label: 'País', type: 'text' },
    { key: 'notaEntrega', label: 'Nota de Entrega', type: 'text' }
  ];

  camposSeleccionados: string[] = [];
  valoresActuales: { [key: string]: string } = {};
  valoresNuevos: { [key: string]: string } = {};

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private solicitudService: SolicitudCambioPerfilService,
    private userService: UserService,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.solicitudForm = this.fb.group({
      comentariosUsuario: ['']
    });
  }

  async ngOnInit() {
    await this.cargarPerfil();
  }

  async cargarPerfil() {
    try {
      // Usar el mismo método que usa la página de perfil real
      this.userService.obtenerTokenData().subscribe({
        next: async (tokenData) => {
          if (tokenData && tokenData.playerId && tokenData.sistemaId) {
            try {
              // Cargar el perfil real usando el mismo método que el perfil
              const perfilReal = await this.userService.getPerfil(tokenData.playerId, tokenData.sistemaId).toPromise();
              if (perfilReal) {
                this.perfil = perfilReal;
                // Actualizar valores actuales con datos reales
                this.camposEditables.forEach(campo => {
                  const valor = (perfilReal as any)[campo.key];
                  this.valoresActuales[campo.key] = valor || 'No especificado';
                });
                return;
              }
            } catch (perfilError) {
              console.warn('Error cargando perfil del servidor:', perfilError);
            }

            // Fallback: crear perfil básico con datos del token
            this.perfil = {
              playerId: tokenData.playerId,
              sistemaId: tokenData.sistemaId,
              sistemaNombre: `Sistema ${tokenData.sistemaId}`,
              nombreCompleto: tokenData.playerId.split('@')[0] || tokenData.playerId,
              apellidoCompleto: 'Usuario',
              fechaNacimiento: '1990-01-01',
              celular: '+56 9 0000 0000',
              numeroDocumento: '12345678-9',
              calle: 'Calle Principal',
              numero: '123',
              comuna: 'Santiago',
              region: 'Metropolitana',
              pais: 'Chile',
              notaEntrega: 'Sin nota especial'
            };
            
            // Inicializar valores actuales
            this.camposEditables.forEach(campo => {
              this.valoresActuales[campo.key] = (this.perfil as any)[campo.key] || 'No especificado';
            });
          }
        },
        error: (error) => {
          console.error('Error obteniendo datos del token:', error);
          this.mostrarError('Error cargando los datos del usuario');
        }
      });
    } catch (error) {
      console.error('Error cargando perfil:', error);
      this.mostrarError('Error cargando los datos del perfil');
    }
  }

  toggleCampo(campoKey: string) {
    const index = this.camposSeleccionados.indexOf(campoKey);
    if (index > -1) {
      this.camposSeleccionados.splice(index, 1);
      delete this.valoresNuevos[campoKey];
    } else {
      this.camposSeleccionados.push(campoKey);
      this.valoresNuevos[campoKey] = this.valoresActuales[campoKey];
    }
  }

  actualizarValorNuevo(campoKey: string, valor: string | null | undefined) {
    this.valoresNuevos[campoKey] = valor || '';
  }

  async enviarSolicitud() {
    if (this.camposSeleccionados.length === 0) {
      this.mostrarError('Debes seleccionar al menos un campo para cambiar');
      return;
    }

    // Validar que todos los campos seleccionados tengan valores nuevos
    for (const campo of this.camposSeleccionados) {
      if (!this.valoresNuevos[campo] || this.valoresNuevos[campo].trim() === '') {
        this.mostrarError(`El campo ${this.camposAmigables[campo]} es requerido`);
        return;
      }
    }

    const loading = await this.loadingController.create({
      message: 'Enviando solicitud...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // Usar los mismos datos que se cargaron en cargarPerfil
      if (!this.perfil || !this.perfil.playerId || !this.perfil.sistemaId) {
        this.mostrarError('Error: No se pudieron obtener los datos del usuario');
        return;
      }

      const request: CrearSolicitudRequest = {
        playerId: this.perfil.playerId,
        sistemaId: this.perfil.sistemaId,
        tipoSolicitud: 'CAMBIO_DATOS_PERSONALES',
        camposCambiar: JSON.stringify(this.camposSeleccionados),
        valoresActuales: JSON.stringify(this.valoresActuales),
        valoresNuevos: JSON.stringify(this.valoresNuevos),
        comentariosUsuario: this.solicitudForm.get('comentariosUsuario')?.value || ''
      };

      await this.solicitudService.crearSolicitud(request).toPromise();
      
      await loading.dismiss();
      await this.mostrarExito('Solicitud enviada correctamente');
      this.router.navigate(['/perfil']);
    } catch (error) {
      await loading.dismiss();
      console.error('Error enviando solicitud:', error);
      this.mostrarError('Error enviando la solicitud. Intenta nuevamente.');
    }
  }

  async mostrarError(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: 'danger',
      position: 'top'
    });
    await toast.present();
  }

  async mostrarExito(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: 'success',
      position: 'top'
    });
    await toast.present();
  }

  cancelar() {
    this.router.navigate(['/perfil']);
  }

  getCampoSeleccionado(campoKey: string): boolean {
    return this.camposSeleccionados.includes(campoKey);
  }

  getValorNuevo(campoKey: string): string {
    return this.valoresNuevos[campoKey] || '';
  }
}