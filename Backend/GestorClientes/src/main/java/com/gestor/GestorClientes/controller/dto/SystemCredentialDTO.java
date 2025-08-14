package com.gestor.GestorClientes.controller.dto;

public record SystemCredentialDTO(
        Long sistemaId,
        String sistemaNombre,
        String username,
        String password,   // la que se enviará al usuario (existente o generada)
        boolean generated  // true si fue generada/cambiada en esta operación
) {}
