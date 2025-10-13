-- =====================================================
-- Script SQL para PostgreSQL
-- Tabla: solicitudes_cambio_perfil
-- Descripción: Gestiona las solicitudes de cambio de datos de perfil de usuarios
-- =====================================================

-- Crear la tabla principal
CREATE TABLE IF NOT EXISTS solicitudes_cambio_perfil (
    id BIGSERIAL PRIMARY KEY,
    player_id VARCHAR(255) NOT NULL,
    sistema_id INTEGER NOT NULL,
    tipo_solicitud VARCHAR(50) NOT NULL CHECK (tipo_solicitud IN ('CAMBIO_DATOS_PERSONALES', 'CAMBIO_CONTACTO', 'CAMBIO_DOCUMENTO', 'CAMBIO_DIRECCION')),
    campos_cambiar TEXT NOT NULL,
    valores_actuales TEXT,
    valores_nuevos TEXT NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'APROBADA', 'RECHAZADA', 'PROCESADA')),
    motivo_rechazo TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_procesamiento TIMESTAMP WITH TIME ZONE NULL,
    admin_procesador VARCHAR(255) NULL,
    comentarios_usuario TEXT,
    comentarios_admin TEXT
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_solicitudes_player_sistema ON solicitudes_cambio_perfil(player_id, sistema_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_cambio_perfil(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_fecha_creacion ON solicitudes_cambio_perfil(fecha_creacion);
CREATE INDEX IF NOT EXISTS idx_solicitudes_campos_cambiar ON solicitudes_cambio_perfil USING gin(to_tsvector('spanish', campos_cambiar));
CREATE INDEX IF NOT EXISTS idx_solicitudes_admin_procesador ON solicitudes_cambio_perfil(admin_procesador);

-- Comentarios sobre la tabla y campos
COMMENT ON TABLE solicitudes_cambio_perfil IS 'Tabla para gestionar solicitudes de cambio de datos de perfil de usuarios';
COMMENT ON COLUMN solicitudes_cambio_perfil.id IS 'Identificador único de la solicitud';
COMMENT ON COLUMN solicitudes_cambio_perfil.player_id IS 'ID del jugador que solicita el cambio';
COMMENT ON COLUMN solicitudes_cambio_perfil.sistema_id IS 'ID del sistema/casino del jugador';
COMMENT ON COLUMN solicitudes_cambio_perfil.tipo_solicitud IS 'Tipo de solicitud: CAMBIO_DATOS_PERSONALES, CAMBIO_CONTACTO, CAMBIO_DOCUMENTO, CAMBIO_DIRECCION';
COMMENT ON COLUMN solicitudes_cambio_perfil.campos_cambiar IS 'JSON con los campos que se desean cambiar';
COMMENT ON COLUMN solicitudes_cambio_perfil.valores_actuales IS 'JSON con los valores actuales de los campos';
COMMENT ON COLUMN solicitudes_cambio_perfil.valores_nuevos IS 'JSON con los nuevos valores solicitados';
COMMENT ON COLUMN solicitudes_cambio_perfil.estado IS 'Estado actual de la solicitud: PENDIENTE, APROBADA, RECHAZADA, PROCESADA';
COMMENT ON COLUMN solicitudes_cambio_perfil.motivo_rechazo IS 'Motivo del rechazo si aplica';
COMMENT ON COLUMN solicitudes_cambio_perfil.fecha_creacion IS 'Fecha y hora de creación de la solicitud';
COMMENT ON COLUMN solicitudes_cambio_perfil.fecha_procesamiento IS 'Fecha y hora de procesamiento de la solicitud';
COMMENT ON COLUMN solicitudes_cambio_perfil.admin_procesador IS 'ID del administrador que procesó la solicitud';
COMMENT ON COLUMN solicitudes_cambio_perfil.comentarios_usuario IS 'Comentarios adicionales del usuario';
COMMENT ON COLUMN solicitudes_cambio_perfil.comentarios_admin IS 'Comentarios del administrador';

-- =====================================================
-- Funciones auxiliares para manejo de JSON
-- =====================================================

-- Función para verificar si una solicitud está pendiente
CREATE OR REPLACE FUNCTION existe_solicitud_pendiente(
    p_player_id VARCHAR(255),
    p_sistema_id INTEGER
) RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM solicitudes_cambio_perfil 
        WHERE player_id = p_player_id 
        AND sistema_id = p_sistema_id 
        AND estado = 'PENDIENTE'
    );
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas de solicitudes
CREATE OR REPLACE FUNCTION obtener_estadisticas_solicitudes()
RETURNS TABLE (
    total BIGINT,
    pendientes BIGINT,
    aprobadas BIGINT,
    rechazadas BIGINT,
    procesadas BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE estado = 'PENDIENTE') as pendientes,
        COUNT(*) FILTER (WHERE estado = 'APROBADA') as aprobadas,
        COUNT(*) FILTER (WHERE estado = 'RECHAZADA') as rechazadas,
        COUNT(*) FILTER (WHERE estado = 'PROCESADA') as procesadas
    FROM solicitudes_cambio_perfil;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Triggers para auditoría
-- =====================================================

-- Tabla de auditoría para cambios en solicitudes
CREATE TABLE IF NOT EXISTS solicitudes_cambio_perfil_audit (
    id BIGSERIAL PRIMARY KEY,
    solicitud_id BIGINT NOT NULL,
    accion VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    usuario_modificacion VARCHAR(255),
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    datos_anteriores JSONB,
    datos_nuevos JSONB
);

-- Función de trigger para auditoría
CREATE OR REPLACE FUNCTION audit_solicitudes_cambio_perfil()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO solicitudes_cambio_perfil_audit (
            solicitud_id, accion, usuario_modificacion, datos_nuevos
        ) VALUES (
            NEW.id, 'INSERT', current_user, to_jsonb(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO solicitudes_cambio_perfil_audit (
            solicitud_id, accion, usuario_modificacion, datos_anteriores, datos_nuevos
        ) VALUES (
            NEW.id, 'UPDATE', current_user, to_jsonb(OLD), to_jsonb(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO solicitudes_cambio_perfil_audit (
            solicitud_id, accion, usuario_modificacion, datos_anteriores
        ) VALUES (
            OLD.id, 'DELETE', current_user, to_jsonb(OLD)
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger
DROP TRIGGER IF EXISTS trigger_audit_solicitudes_cambio_perfil ON solicitudes_cambio_perfil;
CREATE TRIGGER trigger_audit_solicitudes_cambio_perfil
    AFTER INSERT OR UPDATE OR DELETE ON solicitudes_cambio_perfil
    FOR EACH ROW EXECUTE FUNCTION audit_solicitudes_cambio_perfil();

-- =====================================================
-- Vistas útiles para consultas
-- =====================================================

-- Vista para solicitudes pendientes con información adicional
CREATE OR REPLACE VIEW vista_solicitudes_pendientes AS
SELECT 
    scp.id,
    scp.player_id,
    scp.sistema_id,
    scp.tipo_solicitud,
    scp.campos_cambiar,
    scp.valores_actuales,
    scp.valores_nuevos,
    scp.fecha_creacion,
    scp.comentarios_usuario,
    EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - scp.fecha_creacion))/3600 as horas_pendiente
FROM solicitudes_cambio_perfil scp
WHERE scp.estado = 'PENDIENTE'
ORDER BY scp.fecha_creacion ASC;

-- Vista para estadísticas por sistema
CREATE OR REPLACE VIEW vista_estadisticas_por_sistema AS
SELECT 
    sistema_id,
    COUNT(*) as total_solicitudes,
    COUNT(*) FILTER (WHERE estado = 'PENDIENTE') as pendientes,
    COUNT(*) FILTER (WHERE estado = 'APROBADA') as aprobadas,
    COUNT(*) FILTER (WHERE estado = 'RECHAZADA') as rechazadas,
    COUNT(*) FILTER (WHERE estado = 'PROCESADA') as procesadas,
    AVG(EXTRACT(EPOCH FROM (fecha_procesamiento - fecha_creacion))/3600) as tiempo_promedio_procesamiento_horas
FROM solicitudes_cambio_perfil
GROUP BY sistema_id
ORDER BY total_solicitudes DESC;

-- =====================================================
-- Permisos y seguridad
-- =====================================================

-- Crear rol para administradores (ajustar según tu esquema de roles)
-- CREATE ROLE admin_solicitudes;

-- Otorgar permisos (ajustar según tu esquema)
-- GRANT SELECT, INSERT, UPDATE ON solicitudes_cambio_perfil TO admin_solicitudes;
-- GRANT SELECT ON vista_solicitudes_pendientes TO admin_solicitudes;
-- GRANT SELECT ON vista_estadisticas_por_sistema TO admin_solicitudes;
-- GRANT USAGE ON SEQUENCE solicitudes_cambio_perfil_id_seq TO admin_solicitudes;

-- =====================================================
-- Datos de ejemplo (opcional - comentar en producción)
-- =====================================================

/*
-- Ejemplo de inserción de una solicitud
INSERT INTO solicitudes_cambio_perfil (
    player_id, 
    sistema_id, 
    tipo_solicitud, 
    campos_cambiar, 
    valores_actuales, 
    valores_nuevos, 
    comentarios_usuario
) VALUES (
    'PLAYER123',
    1,
    'CAMBIO_DATOS_PERSONALES',
    '["nombreCompleto", "celular", "calle"]',
    '{"nombreCompleto": "Juan Pérez", "celular": "+56912345678", "calle": "Av. Principal 123"}',
    '{"nombreCompleto": "Juan Carlos Pérez", "celular": "+56987654321", "calle": "Av. Nueva 456"}',
    'Necesito actualizar mis datos personales por cambio de domicilio'
);
*/

-- =====================================================
-- Script completado
-- =====================================================
-- Para ejecutar este script:
-- 1. Conéctate a tu base de datos PostgreSQL
-- 2. Ejecuta: \i ruta/al/archivo/create_solicitudes_cambio_perfil_table_postgresql.sql
-- 3. Verifica la creación con: \d solicitudes_cambio_perfil
-- =====================================================
