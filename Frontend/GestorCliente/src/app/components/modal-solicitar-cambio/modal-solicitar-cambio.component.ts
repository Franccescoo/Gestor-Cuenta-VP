import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { UserService } from '../../Service/user.service';
import { SolicitudCambioPerfilService } from '../../Service/solicitud-cambio-perfil.service';
import { CrearSolicitudRequest, SolicitudCambioPerfil } from '../../models/SolicitudCambioPerfil.model';

interface CampoEditable {
  key: string;
  label: string;
  type: string;
  placeholder: string;
}

interface PerfilUsuario {
  playerId: string;
  sistemaId: number;
  sistemaNombre?: string;
  nombreCompleto?: string;
  apellidoCompleto?: string;
  fechaNacimiento?: string;
  celular?: string;
  numeroDocumento?: string;
  calle?: string;
  numero?: string;
  comuna?: string;
  region?: string;
  pais?: string;
  notaEntrega?: string;
}

@Component({
  selector: 'app-modal-solicitar-cambio',
  templateUrl: './modal-solicitar-cambio.component.html',
  styleUrls: ['./modal-solicitar-cambio.component.scss']
})
export class ModalSolicitarCambioComponent implements OnInit {
  @Input() perfil: PerfilUsuario | null = null;

  camposEditables: CampoEditable[] = [
    { key: 'nombreCompleto', label: 'Nombre', type: 'text', placeholder: 'Nuevo nombre' },
    { key: 'apellidoCompleto', label: 'Apellido', type: 'text', placeholder: 'Nuevo apellido' },
    { key: 'fechaNacimiento', label: 'Fecha de Nacimiento', type: 'date', placeholder: 'Nueva fecha' },
    { key: 'celular', label: 'Celular', type: 'tel', placeholder: 'Nuevo celular' },
    { key: 'numeroDocumento', label: 'Número de Documento', type: 'text', placeholder: 'Nuevo número' },
    { key: 'calle', label: 'Calle', type: 'text', placeholder: 'Nueva calle' },
    { key: 'numero', label: 'Número', type: 'text', placeholder: 'Nuevo número' },
    { key: 'comuna', label: 'Comuna', type: 'text', placeholder: 'Nueva comuna' },
    { key: 'region', label: 'Región', type: 'text', placeholder: 'Nueva región' },
    { key: 'pais', label: 'País', type: 'text', placeholder: 'Nuevo país' },
    { key: 'notaEntrega', label: 'Nota de Entrega', type: 'text', placeholder: 'Nueva nota' }
  ];

  camposSeleccionados: string[] = [];
  valoresActuales: { [key: string]: string } = {};
  valoresNuevos: { [key: string]: string } = {};
  solicitudForm: FormGroup;
  cargando = false;

  camposAmigables: { [key: string]: string } = {
    'nombreCompleto': 'Nombre',
    'apellidoCompleto': 'Apellido',
    'fechaNacimiento': 'Fecha de Nacimiento',
    'celular': 'Celular',
    'numeroDocumento': 'Número de Documento',
    'calle': 'Calle',
    'numero': 'Número',
    'region': 'Región',
    'comuna': 'Comuna',
    'pais': 'País',
    'notaEntrega': 'Nota de Entrega'
  };

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private userService: UserService,
    private solicitudService: SolicitudCambioPerfilService
  ) {
    this.solicitudForm = this.fb.group({
      comentariosUsuario: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit() {
    if (this.perfil) {
      this.inicializarValores();
    }
  }

  inicializarValores() {
    if (this.perfil) {
      this.camposEditables.forEach(campo => {
        this.valoresActuales[campo.key] = (this.perfil as any)[campo.key] || 'No especificado';
      });
    }
  }

  toggleCampo(campoKey: string) {
    const index = this.camposSeleccionados.indexOf(campoKey);
    if (index > -1) {
      this.camposSeleccionados.splice(index, 1);
      delete this.valoresNuevos[campoKey];
    } else {
      this.camposSeleccionados.push(campoKey);
      this.valoresNuevos[campoKey] = '';
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

      const response = await this.solicitudService.crearSolicitud(request).toPromise();
      
      await loading.dismiss();
      this.mostrarExito('Solicitud enviada correctamente');
      
      // Cerrar modal y navegar a mis solicitudes
      this.modalController.dismiss();
      this.router.navigate(['/mis-solicitudes']);

    } catch (error) {
      await loading.dismiss();
      console.error('Error enviando solicitud:', error);
      this.mostrarError('Error al enviar la solicitud. Inténtalo de nuevo.');
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
    this.modalController.dismiss();
  }

  getCampoSeleccionado(campoKey: string): boolean {
    return this.camposSeleccionados.includes(campoKey);
  }

  getValorNuevo(campoKey: string): string {
    return this.valoresNuevos[campoKey] || '';
  }
}
