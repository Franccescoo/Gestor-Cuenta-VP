package com.gestor.GestorClientes.controller.dto;

import jakarta.validation.constraints.Size;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Validated
public record AuthCreateRoleRequest(
        @Size(max = 1,message = "Solo se permite un rol por usuario")
        List<String>roleListName
){
}