package com.gestor.GestorClientes.persistence.repositories;

import com.gestor.GestorClientes.controller.dto.HistorialCanjeDetalleDTO;
import com.gestor.GestorClientes.persistence.entity.HistorialCanjeBeneficioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistorialCanjeBeneficioRepository extends JpaRepository<HistorialCanjeBeneficioEntity, Long> {
    List<HistorialCanjeBeneficioEntity> findByPlayerIdAndSistemaId(String playerId, Integer sistemaId);

    @Query("SELECT new com.gestor.GestorClientes.controller.dto.HistorialCanjeDetalleDTO(" +
            "h.id, h.playerId, h.sistemaId, h.estado, h.fechaCanje, h.fechaRespuesta, h.motivoRechazo, " +
            "b, c) " +
            "FROM HistorialCanjeBeneficioEntity h " +
            "JOIN BeneficioEntity b ON b.id = h.beneficioId " +
            "JOIN CategoriaEntity c ON c.id = h.categoriaId " +
            "WHERE h.playerId = :playerId AND h.sistemaId = :sistemaId")
    List<HistorialCanjeDetalleDTO> findHistorialConDetalle(@Param("playerId") String playerId,
                                                           @Param("sistemaId") Integer sistemaId);

}
