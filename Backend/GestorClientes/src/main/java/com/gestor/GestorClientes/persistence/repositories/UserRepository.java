package com.gestor.GestorClientes.persistence.repositories;

import com.gestor.GestorClientes.persistence.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, String> {
    // UserRepository.java
    Optional<UserEntity> findByUsername(String username);
    Optional<UserEntity> findByPlayerIdAndRolId(String playerId, Integer rolId);

    // Busca por playerId y sistema_id (que en tu entidad es rolId)
    @Query("SELECT u FROM UserEntity u WHERE u.playerId = :playerId AND u.rolId = :sistemaId")
    Optional<UserEntity> findByPlayerIdAndSistemaId(String playerId, Integer sistemaId);

}
