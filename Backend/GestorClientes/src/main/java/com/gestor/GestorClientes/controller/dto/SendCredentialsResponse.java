package com.gestor.GestorClientes.controller.dto;

import java.util.List;

public record SendCredentialsResponse(
        String email,
        int total,
        List<SystemCredentialDTO> sistemas
) {}
