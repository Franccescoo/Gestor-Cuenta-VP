// src/main/java/com/gestor/GestorClientes/controller/dto/UserDashboardDTO.java
package com.gestor.GestorClientes.controller.dto;

import java.time.LocalDate;

public record UserDashboardDTO(
        String playerId,
        Integer sistemaId,
        String nombre,
        String email,
        Integer puntos,
        String nivel,
        Integer metaNivel,
        Integer puntosFaltantes,
        Integer progreso,
        LocalDate ultimaActualizacion
) {}
