export interface SolicitudCambioPerfil {
  id: number;
  playerId: string;
  sistemaId: number;
  tipoSolicitud: string;
  camposCambiar: string;
  valoresActuales: string;
  valoresNuevos: string;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'PROCESADA';
  motivoRechazo?: string;
  fechaCreacion: string;
  fechaProcesamiento?: string;
  adminProcesador?: string;
  comentariosUsuario?: string;
  comentariosAdmin?: string;
  nombreUsuario?: string;
  emailUsuario?: string;
}

export interface CrearSolicitudRequest {
  playerId: string;
  sistemaId: number;
  tipoSolicitud: 'CAMBIO_DATOS_PERSONALES' | 'CAMBIO_CONTACTO' | 'CAMBIO_DOCUMENTO' | 'CAMBIO_DIRECCION';
  camposCambiar: string;
  valoresActuales: string;
  valoresNuevos: string;
  comentariosUsuario?: string;
}

export interface AprobarSolicitudRequest {
  adminProcesador: string;
  comentariosAdmin?: string;
}

export interface RechazarSolicitudRequest {
  adminProcesador: string;
  motivoRechazo: string;
  comentariosAdmin?: string;
}

export interface EstadisticasSolicitudes {
  total: number;
  pendientes: number;
  aprobadas: number;
  rechazadas: number;
}

// Mapeo de campos para mostrar nombres más amigables
export const CAMPOS_AMIGABLES: { [key: string]: string } = {
  'nombreCompleto': 'Nombre',
  'apellidoCompleto': 'Apellido',
  'celular': 'Celular',
  'numeroDocumento': 'Número de Documento',
  'tipoDocumento': 'Tipo de Documento',
  'calle': 'Calle',
  'numero': 'Número',
  'comuna': 'Comuna',
  'region': 'Región',
  'pais': 'País',
  'notaEntrega': 'Nota de Entrega'
};

// Mapeo de tipos de solicitud para mostrar nombres más amigables
export const TIPOS_SOLICITUD_AMIGABLES: { [key: string]: string } = {
  'CAMBIO_DATOS_PERSONALES': 'Cambio de Datos Personales',
  'CAMBIO_CONTACTO': 'Cambio de Información de Contacto',
  'CAMBIO_DOCUMENTO': 'Cambio de Documento',
  'CAMBIO_DIRECCION': 'Cambio de Dirección'
};

// Mapeo de estados para mostrar nombres más amigables
export const ESTADOS_AMIGABLES: { [key: string]: string } = {
  'PENDIENTE': 'Pendiente',
  'APROBADA': 'Aprobada',
  'RECHAZADA': 'Rechazada',
  'PROCESADA': 'Procesada'
};

// Colores para los estados
export const COLORES_ESTADO: { [key: string]: string } = {
  'PENDIENTE': 'warning',
  'APROBADA': 'success',
  'RECHAZADA': 'danger',
  'PROCESADA': 'primary'
};
