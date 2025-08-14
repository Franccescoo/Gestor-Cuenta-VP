package com.gestor.GestorClientes.persistence.repositories.projections;

import java.time.LocalDate;

public interface UserDashProjection {
    String getPlayerId();
    Integer getRolId();                     // sistema_id en tu tabla
    String getNombreCompleto();
    String getEmail();
    Integer getPuntosTotal();
    Integer getCategoriaId();
    LocalDate getFechaUltimaActualizacion();
}
