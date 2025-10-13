package com.gestor.GestorClientes.persistence.repositories;

import com.gestor.GestorClientes.persistence.entity.SolicitudCambioPerfil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SolicitudCambioPerfilRepository extends JpaRepository<SolicitudCambioPerfil, Long> {

    // Buscar solicitudes por usuario
    List<SolicitudCambioPerfil> findByPlayerIdAndSistemaIdOrderByFechaCreacionDesc(String playerId, Integer sistemaId);

    // Buscar solicitudes pendientes
    List<SolicitudCambioPerfil> findByEstadoOrderByFechaCreacionDesc(SolicitudCambioPerfil.EstadoSolicitud estado);

    // Buscar todas las solicitudes para admin
    @Query("SELECT s FROM SolicitudCambioPerfil s ORDER BY s.fechaCreacion DESC")
    List<SolicitudCambioPerfil> findAllOrderByFechaCreacionDesc();

    // Buscar solicitudes por estado y usuario
    List<SolicitudCambioPerfil> findByPlayerIdAndSistemaIdAndEstadoOrderByFechaCreacionDesc(
        String playerId, Integer sistemaId, SolicitudCambioPerfil.EstadoSolicitud estado);

    // Verificar si ya existe una solicitud pendiente para el mismo usuario
    @Query("SELECT COUNT(s) > 0 FROM SolicitudCambioPerfil s WHERE s.playerId = :playerId " +
           "AND s.sistemaId = :sistemaId AND s.estado = 'PENDIENTE'")
    boolean existsSolicitudPendiente(@Param("playerId") String playerId, 
                                   @Param("sistemaId") Integer sistemaId, 
                                   @Param("campoCambiar") String campoCambiar);

    // Buscar solicitud específica por ID
    Optional<SolicitudCambioPerfil> findByIdAndPlayerIdAndSistemaId(Long id, String playerId, Integer sistemaId);

    // Contar solicitudes por estado
    long countByEstado(SolicitudCambioPerfil.EstadoSolicitud estado);
}
