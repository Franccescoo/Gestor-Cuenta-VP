package com.gestor.GestorClientes.controller.dto;

import java.util.List;

public record SendCredentialsRequest(
        String email,
        String recaptchaToken
) {}