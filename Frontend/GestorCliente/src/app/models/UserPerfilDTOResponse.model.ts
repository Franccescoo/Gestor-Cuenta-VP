// Respuesta cruda del backend (snake_case)
export interface UserPerfilDTOResponse {
  player_id: string;
  sistema_id: number;
  puntos_total: number | null;
  fecha_ultima_actualizacion: string | null;

  nombre_completo: string | null;
  apellido_completo: string | null;
  fecha_cumpleanos: string | null;

  email: string | null;
  celular: string | null;
  login: string | null;

  tipo_documento: string | null;
  numero_documento: string | null;

  verificado: boolean | null;
  activo: boolean | null;

  categoria_id: number | null;
  usuarios: string | null;

  // opcionales si luego los agregas en el backend
  categoria_nombre?: string | null;
  foto_url?: string | null;
}

// Modelo normalizado para la app (camelCase)
export interface UserPerfilDTO {
  playerId: string;
  sistemaId: number;
  puntosTotal: number | null;
  fechaUltimaActualizacion: string | null;

  nombreCompleto: string | null;
  apellidoCompleto: string | null;
  fechaCumpleanos: string | null;

  email: string | null;
  celular: string | null;
  login: string | null;

  tipoDocumento: string | null;
  numeroDocumento: string | null;

  verificado: boolean | null;
  activo: boolean | null;

  categoriaId: number | null;
  usuarios: string | null;

  // opcionales
  categoriaNombre?: string | null;
  fotoUrl?: string | null;
}

// Mapper: snake_case -> camelCase
export function mapUserPerfilResponse(r: UserPerfilDTOResponse): UserPerfilDTO {
  return {
    playerId: r.player_id,
    sistemaId: r.sistema_id,
    puntosTotal: r.puntos_total,
    fechaUltimaActualizacion: r.fecha_ultima_actualizacion,

    nombreCompleto: r.nombre_completo,
    apellidoCompleto: r.apellido_completo,
    fechaCumpleanos: r.fecha_cumpleanos,

    email: r.email,
    celular: r.celular,
    login: r.login,

    tipoDocumento: r.tipo_documento,
    numeroDocumento: r.numero_documento,

    verificado: r.verificado,
    activo: r.activo,

    categoriaId: r.categoria_id,
    usuarios: r.usuarios,

    categoriaNombre: r.categoria_nombre,
    fotoUrl: r.foto_url,
  };
}

// Payload para el PUT /actualizar (camelCase)
export type ActualizarUsuarioRequest = Partial<{
  nombreCompleto: string | null;
  apellidoCompleto: string | null;
  fechaCumpleanos: string | null;
  email: string | null;
  celular: string | null;
  numeroDocumento: string | null;
  tipoDocumento: string | null;
  login: string | null;
  puntosTotal: number | null;
  fechaUltimaActualizacion: string | null;
  verificado: boolean | null;
  activo: boolean | null;
  categoriaId: number | null;
}>;
