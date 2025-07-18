package com.gestor.GestorClientes.persistence.repositories;

import com.gestor.GestorClientes.persistence.entity.SistemaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SistemaRepository extends JpaRepository<SistemaEntity, Integer> {
}
