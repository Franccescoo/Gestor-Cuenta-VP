package com.gestor.GestorClientes.controller.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({"username", "message", "status", "jwt", "sistema", "debeCompletarRegistro"})
public record AuthResponse(
        String username,
        String message,
        String jwt,
        Boolean status,
        String sistema,
        Boolean debeCompletarRegistro
) {}
