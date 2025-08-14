// src/main/java/com/gestor/GestorClientes/persistence/repositories/BeneficioRepository.java
package com.gestor.GestorClientes.persistence.repositories;

import com.gestor.GestorClientes.persistence.entity.BeneficioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BeneficioRepository extends JpaRepository<BeneficioEntity, Integer> {}
