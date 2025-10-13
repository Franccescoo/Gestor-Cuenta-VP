import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SolicitudCambioPerfilService } from 'src/app/Service/solicitud-cambio-perfil.service';
import { UserService } from 'src/app/Service/user.service';
import { SolicitudCambioPerfil, CAMPOS_AMIGABLES, TIPOS_SOLICITUD_AMIGABLES, ESTADOS_AMIGABLES, COLORES_ESTADO } from 'src/app/models/SolicitudCambioPerfil.model';

@Component({
  selector: 'app-mis-solicitudes',
  templateUrl: './mis-solicitudes.page.html',
  styleUrls: ['./mis-solicitudes.page.scss'],
})
export class MisSolicitudesPage implements OnInit {
  solicitudes: SolicitudCambioPerfil[] = [];
  playerId!: string;
  sistemaId!: number;
  cargando = true;

  // Mapeos para mostrar nombres amigables
  camposAmigables = CAMPOS_AMIGABLES;
  tiposAmigables = TIPOS_SOLICITUD_AMIGABLES;
  estadosAmigables = ESTADOS_AMIGABLES;
  coloresEstado = COLORES_ESTADO;

  constructor(
    private solicitudService: SolicitudCambioPerfilService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario() {
    this.userService.obtenerTokenData().subscribe({
      next: (resp) => {
        this.playerId = resp.playerId;
        this.sistemaId = resp.sistemaId;
        this.cargarSolicitudes();
      },
      error: () => {
        alert('No se pudo obtener tus datos del token.');
        this.router.navigate(['/perfil']);
      }
    });
  }

  cargarSolicitudes() {
    this.cargando = true;
    this.solicitudService.obtenerSolicitudesUsuario(this.playerId, this.sistemaId).subscribe({
      next: (solicitudes) => {
        this.solicitudes = solicitudes;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar solicitudes:', err);
        this.cargando = false;
      }
    });
  }

  irASolicitarCambio(): void {
    this.router.navigate(['/solicitar-cambio-perfil']);
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getIconoEstado(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'time-outline';
      case 'APROBADA': return 'checkmark-circle-outline';
      case 'RECHAZADA': return 'close-circle-outline';
      case 'PROCESADA': return 'checkmark-done-circle-outline';
      default: return 'help-circle-outline';
    }
  }

  getMensajeEstado(solicitud: SolicitudCambioPerfil): string {
    switch (solicitud.estado) {
      case 'PENDIENTE':
        return 'Tu solicitud está siendo revisada por un administrador.';
      case 'APROBADA':
        return 'Tu solicitud ha sido aprobada y está siendo procesada.';
      case 'RECHAZADA':
        return solicitud.motivoRechazo ? 
          `Tu solicitud fue rechazada: ${solicitud.motivoRechazo}` :
          'Tu solicitud fue rechazada.';
      case 'PROCESADA':
        return 'Los cambios han sido aplicados a tu perfil.';
      default:
        return 'Estado desconocido.';
    }
  }

  obtenerCamposTexto(camposJson: string): string {
    try {
      const campos = JSON.parse(camposJson);
      if (Array.isArray(campos)) {
        return campos.map(campo => this.camposAmigables[campo] || campo).join(', ');
      }
      return this.camposAmigables[camposJson] || camposJson;
    } catch {
      return this.camposAmigables[camposJson] || camposJson;
    }
  }

  obtenerValoresTexto(valoresJson: string): string {
    try {
      const valores = JSON.parse(valoresJson);
      if (typeof valores === 'object') {
        return Object.entries(valores)
          .map(([campo, valor]) => `${this.camposAmigables[campo] || campo}: ${valor}`)
          .join(', ');
      }
      return valoresJson;
    } catch {
      return valoresJson;
    }
  }

  refrescar() {
    this.cargarSolicitudes();
  }
}
