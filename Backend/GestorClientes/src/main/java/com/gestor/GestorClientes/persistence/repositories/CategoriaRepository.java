// src/main/java/com/gestor/GestorClientes/persistence/repositories/CategoriaRepository.java
package com.gestor.GestorClientes.persistence.repositories;

import com.gestor.GestorClientes.persistence.entity.CategoriaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<CategoriaEntity, Integer> {

    List<CategoriaEntity> findBySistemaIdAndActivoTrueOrderByNivelAscNombreAsc(Integer sistemaId);


    // Categoría actual por id + sistema
    Optional<CategoriaEntity> findByIdAndSistemaId(Integer id, Integer sistemaId);

    // Siguiente categoría por nivel dentro del mismo sistema
    Optional<CategoriaEntity> findFirstBySistemaIdAndNivel(Integer sistemaId, Integer nivel);

    // Inferir categoría por rango de puntos cuando categoria_id está null
    Optional<CategoriaEntity> findFirstBySistemaIdAndPuntosInicioLessThanEqualAndPuntosFinalGreaterThan(
            Integer sistemaId, Integer puntos, Integer puntos2 // puntos2 = puntos para ">"
    );

    // Alternativa (algunos prefieren inclusivo en el upper bound):
    Optional<CategoriaEntity> findFirstBySistemaIdAndPuntosInicioLessThanEqualAndPuntosFinalGreaterThanEqual(
            Integer sistemaId, Integer puntosInicio, Integer puntosFinal);
}
