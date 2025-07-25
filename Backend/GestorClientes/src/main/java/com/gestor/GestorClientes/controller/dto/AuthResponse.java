package com.gestor.GestorClientes.controller.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({"username", "message", "status", "jwt", "sistemaId", "sistemaNombre", "debeCompletarRegistro"})
public record AuthResponse(
        String username,
        String message,
        String jwt,
        Boolean status,
        Integer sistemaId,
        String sistemaNombre,
        Boolean debeCompletarRegistro
) {}
