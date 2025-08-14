// src/main/java/com/gestor/GestorClientes/persistence/entity/BeneficioEntity.java
package com.gestor.GestorClientes.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "beneficio")
public class BeneficioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "sistema_id", nullable = false)
    private Integer sistemaId;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    // Getters/Setters
    public Integer getId() { return id; }
    public Integer getSistemaId() { return sistemaId; }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }

    public void setId(Integer id) { this.id = id; }
    public void setSistemaId(Integer sistemaId) { this.sistemaId = sistemaId; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
