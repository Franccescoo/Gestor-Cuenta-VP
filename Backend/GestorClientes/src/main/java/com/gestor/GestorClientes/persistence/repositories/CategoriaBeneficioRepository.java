// src/main/java/com/gestor/GestorClientes/persistence/repositories/CategoriaBeneficioRepository.java
package com.gestor.GestorClientes.persistence.repositories;

import com.gestor.GestorClientes.controller.dto.BeneficioDTO;
import com.gestor.GestorClientes.persistence.entity.BeneficioEntity;
import com.gestor.GestorClientes.persistence.entity.CategoriaBeneficioEntity;
import com.gestor.GestorClientes.persistence.repositories.projections.CategoriaBeneficioRow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CategoriaBeneficioRepository extends JpaRepository<CategoriaBeneficioEntity, Integer> {


    @Query(
            value = """
                SELECT cb.categoria_id       AS categoriaId,
                       b.id                  AS beneficioId,
                       b.nombre              AS beneficioNombre,
                       b.descripcion         AS beneficioDescripcion
                  FROM categoria_beneficio cb
                  JOIN beneficio b
                    ON b.id = cb.beneficio_id
                   AND b.sistema_id = cb.sistema_id
                 WHERE cb.sistema_id = :systemId
                 ORDER BY cb.categoria_id ASC, b.nombre ASC
                """,
            nativeQuery = true
    )
    List<CategoriaBeneficioRow> findAllRowsBySystem(@Param("systemId") Integer systemId);

    // Si prefieres devolver DTOs directamente:
    @Query("""
    select new com.gestor.GestorClientes.controller.dto.BeneficioDTO(b.id, b.nombre, b.descripcion)
    from BeneficioEntity b
    where b.sistemaId = :sistemaId
      and b.id in (
        select cb.beneficioId
        from CategoriaBeneficioEntity cb
        where cb.sistemaId = :sistemaId
          and cb.categoriaId = :categoriaId
      )
    order by b.nombre
""")
    List<BeneficioDTO> findBeneficiosDTOBySistemaAndCategoria(
            @Param("sistemaId") Integer sistemaId,
            @Param("categoriaId") Integer categoriaId
    );

}
