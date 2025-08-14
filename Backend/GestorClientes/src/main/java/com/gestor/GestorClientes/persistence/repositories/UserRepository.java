package com.gestor.GestorClientes.persistence.repositories;

import com.gestor.GestorClientes.persistence.entity.UserEntity;
import com.gestor.GestorClientes.persistence.repositories.projections.UserDashProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, String> {
    // Busca por playerId y sistema_id (que en tu entidad es rolId)
    @Query("SELECT u FROM UserEntity u WHERE u.playerId = :playerId AND u.rolId = :sistemaId")
    Optional<UserEntity> findByPlayerIdAndSistemaId(String playerId, Integer sistemaId);


    // (opcionales) por email/login si alguna vez lo usas
    Optional<UserDashProjection> findTopByEmailIgnoreCaseOrderByFechaUltimaActualizacionDesc(String email);
    Optional<UserDashProjection> findTopByLoginIgnoreCaseOrderByFechaUltimaActualizacionDesc(String login);


    // ===== ENTIDAD: usar en updates =====
    Optional<UserEntity> findEntityByPlayerIdAndRolId(String playerId, Integer rolId);

    // (si los usas en otros lados)
    Optional<UserEntity> findByUsername(String username);
    List<UserEntity> findAllByEmail(String email);
    List<UserEntity> findAllByEmailIgnoreCase(String email);

    // ===== PROYECCIÓN: usar en dashboard/lecturas =====
    Optional<UserDashProjection> findByPlayerIdAndRolId(String playerId, Integer rolId);
    Optional<UserDashProjection> findTopByPlayerIdOrderByFechaUltimaActualizacionDesc(String playerId);
}
