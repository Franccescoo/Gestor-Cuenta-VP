package com.gestor.GestorClientes.controller.dto;

import com.gestor.GestorClientes.persistence.entity.SolicitudCambioPerfil;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class SolicitudCambioPerfilDTO {
    private Long id;
    private String playerId;
    private Integer sistemaId;
    private String sistemaNombre; // Para mostrar en el front
    private SolicitudCambioPerfil.TipoSolicitud tipoSolicitud;
    private String camposCambiar;
    private String valoresActuales;
    private String valoresNuevos;
    private SolicitudCambioPerfil.EstadoSolicitud estado;
    private String motivoRechazo;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaProcesamiento;
    private String adminProcesador;
    private String comentariosUsuario;
    private String comentariosAdmin;

    // Datos del usuario para mostrar en el admin
    private String nombreUsuario;
    private String emailUsuario;

    public SolicitudCambioPerfilDTO(SolicitudCambioPerfil entity) {
        this.id = entity.getId();
        this.playerId = entity.getPlayerId();
        this.sistemaId = entity.getSistemaId();
        this.tipoSolicitud = entity.getTipoSolicitud();
        this.camposCambiar = entity.getCamposCambiar();
        this.valoresActuales = entity.getValoresActuales();
        this.valoresNuevos = entity.getValoresNuevos();
        this.estado = entity.getEstado();
        this.motivoRechazo = entity.getMotivoRechazo();
        this.fechaCreacion = entity.getFechaCreacion();
        this.fechaProcesamiento = entity.getFechaProcesamiento();
        this.adminProcesador = entity.getAdminProcesador();
        this.comentariosUsuario = entity.getComentariosUsuario();
        this.comentariosAdmin = entity.getComentariosAdmin();
        // sistemaNombre y datos de usuario se llenan en el servicio
    }
}