export interface UserDashboardDTO {
  playerId: string;
  sistemaId: number;
  nombre: string | null;
  email: string | null;
  puntos: number;

  // Estos pueden venir null si no hay categoría asociada
  nivel: string | null;
  metaNivel: number | null;
  puntosFaltantes: number | null;
  progreso: number | null;

  // ISO string (yyyy-mm-dd) desde el backend
  ultimaActualizacion: string | null;
}
