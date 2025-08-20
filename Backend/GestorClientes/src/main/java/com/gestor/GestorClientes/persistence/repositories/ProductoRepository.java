package com.gestor.GestorClientes.persistence.repositories;

import com.gestor.GestorClientes.persistence.entity.ProductoEntity;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<ProductoEntity, Long> {

    @Query("""
        SELECT DISTINCT p
        FROM ProductoEntity p
        JOIN FETCH p.sistema s
        JOIN FETCH p.categoria c
        WHERE (:sistemaId IS NULL OR s.id = :sistemaId)
          AND (:activo IS NULL OR p.activo = :activo)
        ORDER BY c.nivel ASC, p.nombre ASC
    """)
    List<ProductoEntity> findAllFull(
            @Param("sistemaId") Integer sistemaId,
            @Param("activo") Boolean activo
    );
}
