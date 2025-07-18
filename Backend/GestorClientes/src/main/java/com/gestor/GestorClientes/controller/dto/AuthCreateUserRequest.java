package com.gestor.GestorClientes.controller.dto;

import jakarta.validation.Valid;

public record AuthCreateUserRequest(@Valid String username,
                                    @Valid String password,
                                    @Valid boolean isActivated,
                                    @Valid AuthCreateRoleRequest authCreateRoleRequest
) {
}

