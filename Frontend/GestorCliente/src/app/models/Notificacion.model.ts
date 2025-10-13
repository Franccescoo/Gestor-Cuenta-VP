/**
 * Modelo de Notificación recibida por WebSocket
 */
export interface Notificacion {
  id?: number;
  playerId?: string;
  sistemaId?: number;
  tipo: string; // CANJE_APROBADO, CANJE_RECHAZADO, etc.
  titulo: string;
  mensaje: string;
  leida?: boolean;
  fechaCreacion: string; // Fecha de creación (ISO string)
  fechaLectura?: string; // Fecha de lectura (ISO string)
  canjeId?: number;
  beneficioNombre?: string;
}

