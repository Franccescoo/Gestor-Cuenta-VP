package com.gestor.GestorClientes.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitudes_cambio_perfil")
@Getter
@Setter
@NoArgsConstructor
public class SolicitudCambioPerfil {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "player_id", nullable = false)
    private String playerId;

    @Column(name = "sistema_id", nullable = false)
    private Integer sistemaId;

    @Column(name = "tipo_solicitud", nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoSolicitud tipoSolicitud;

    @Column(name = "campos_cambiar", columnDefinition = "TEXT", nullable = false)
    private String camposCambiar; // JSON con los campos a cambiar

    @Column(name = "valores_actuales", columnDefinition = "TEXT")
    private String valoresActuales; // JSON con los valores actuales

    @Column(name = "valores_nuevos", columnDefinition = "TEXT", nullable = false)
    private String valoresNuevos; // JSON con los valores nuevos

    @Column(name = "estado", nullable = false)
    @Enumerated(EnumType.STRING)
    private EstadoSolicitud estado = EstadoSolicitud.PENDIENTE;

    @Column(name = "motivo_rechazo", columnDefinition = "TEXT")
    private String motivoRechazo;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_procesamiento")
    private LocalDateTime fechaProcesamiento;

    @Column(name = "admin_procesador")
    private String adminProcesador;

    @Column(name = "comentarios_usuario", columnDefinition = "TEXT")
    private String comentariosUsuario;

    @Column(name = "comentarios_admin", columnDefinition = "TEXT")
    private String comentariosAdmin;

    // Constructor con parámetros
    public SolicitudCambioPerfil(String playerId, Integer sistemaId, TipoSolicitud tipoSolicitud, 
                                String camposCambiar, String valoresActuales, String valoresNuevos) {
        this.playerId = playerId;
        this.sistemaId = sistemaId;
        this.tipoSolicitud = tipoSolicitud;
        this.camposCambiar = camposCambiar;
        this.valoresActuales = valoresActuales;
        this.valoresNuevos = valoresNuevos;
        this.fechaCreacion = LocalDateTime.now();
        this.estado = EstadoSolicitud.PENDIENTE;
    }

    // Enums
    public enum TipoSolicitud {
        CAMBIO_DATOS_PERSONALES,
        CAMBIO_CONTACTO,
        CAMBIO_DOCUMENTO,
        CAMBIO_DIRECCION
    }

    public enum EstadoSolicitud {
        PENDIENTE,
        APROBADA,
        RECHAZADA,
        PROCESADA
    }

}
