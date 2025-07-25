package com.gestor.GestorClientes.persistence.id;

import java.io.Serializable;
import java.util.Objects;

public class UserEntityId implements Serializable {
    private String playerId;
    private Integer rolId; // O sistemaId, pero debe coincidir con el nombre en la entidad

    // Constructor vacío
    public UserEntityId() {}

    // Constructor con campos
    public UserEntityId(String playerId, Integer rolId) {
        this.playerId = playerId;
        this.rolId = rolId;
    }

    // Getters, Setters, equals() y hashCode()
    // ¡IMPORTANTE para que JPA funcione bien!
    // Puedes generarlos con tu IDE

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserEntityId)) return false;
        UserEntityId that = (UserEntityId) o;
        return Objects.equals(playerId, that.playerId) && Objects.equals(rolId, that.rolId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(playerId, rolId);
    }
}
