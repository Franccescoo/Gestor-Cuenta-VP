package com.gestor.GestorClientes.controller.dto;

import com.gestor.GestorClientes.persistence.entity.SolicitudCambioPerfil;

public record CrearSolicitudRequest(
    String playerId,
    Integer sistemaId,
    SolicitudCambioPerfil.TipoSolicitud tipoSolicitud,
    String camposCambiar,
    String valoresActuales,
    String valoresNuevos,
    String comentariosUsuario
) {}
