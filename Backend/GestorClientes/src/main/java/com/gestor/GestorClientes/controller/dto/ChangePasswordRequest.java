package com.gestor.GestorClientes.controller.dto;

public record ChangePasswordRequest(
        String playerId,
        Integer sistemaId,
        String newPassword
) {}
