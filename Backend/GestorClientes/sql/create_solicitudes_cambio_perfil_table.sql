-- Tabla para almacenar solicitudes de cambio de perfil
CREATE TABLE IF NOT EXISTS solicitudes_cambio_perfil (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    player_id VARCHAR(255) NOT NULL,
    sistema_id INT NOT NULL,
    tipo_solicitud ENUM('CAMBIO_DATOS_PERSONALES', 'CAMBIO_CONTACTO', 'CAMBIO_DOCUMENTO', 'CAMBIO_DIRECCION') NOT NULL,
    campos_cambiar TEXT NOT NULL,
    valores_actuales TEXT,
    valores_nuevos TEXT NOT NULL,
    estado ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA', 'PROCESADA') NOT NULL DEFAULT 'PENDIENTE',
    motivo_rechazo TEXT,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_procesamiento DATETIME NULL,
    admin_procesador VARCHAR(255) NULL,
    comentarios_usuario TEXT,
    comentarios_admin TEXT,
    
    INDEX idx_player_sistema (player_id, sistema_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha_creacion (fecha_creacion),
    INDEX idx_campos_cambiar (campos_cambiar(100))
);

-- Comentarios sobre los campos
ALTER TABLE solicitudes_cambio_perfil 
COMMENT = 'Tabla para gestionar solicitudes de cambio de datos de perfil de usuarios';

-- Ejemplos de uso:
-- INSERT INTO solicitudes_cambio_perfil (player_id, sistema_id, tipo_solicitud, campo_cambiar, valor_actual, valor_nuevo, comentarios_usuario)
-- VALUES ('123456', 1, 'CAMBIO_DATOS_PERSONALES', 'nombreCompleto', 'Juan', 'Juan Carlos', 'Me cambié el nombre legalmente');
