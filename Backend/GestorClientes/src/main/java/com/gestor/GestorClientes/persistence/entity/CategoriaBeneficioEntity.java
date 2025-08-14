// src/main/java/com/gestor/GestorClientes/persistence/entity/CategoriaBeneficioEntity.java
package com.gestor.GestorClientes.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "categoria_beneficio")
public class CategoriaBeneficioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "sistema_id", nullable = false)
    private Integer sistemaId;

    @Column(name = "categoria_id", nullable = false)
    private Integer categoriaId;

    @Column(name = "beneficio_id", nullable = false)
    private Integer beneficioId;

    // Getters/Setters
    public Integer getId() { return id; }
    public Integer getSistemaId() { return sistemaId; }
    public Integer getCategoriaId() { return categoriaId; }
    public Integer getBeneficioId() { return beneficioId; }

    public void setId(Integer id) { this.id = id; }
    public void setSistemaId(Integer sistemaId) { this.sistemaId = sistemaId; }
    public void setCategoriaId(Integer categoriaId) { this.categoriaId = categoriaId; }
    public void setBeneficioId(Integer beneficioId) { this.beneficioId = beneficioId; }
}
