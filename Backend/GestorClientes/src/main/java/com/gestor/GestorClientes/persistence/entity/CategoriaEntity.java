// src/main/java/com/gestor/GestorClientes/persistence/entity/CategoriaEntity.java
package com.gestor.GestorClientes.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "categoria")
public class CategoriaEntity {

    @Id
    private Integer id;

    @Column(name = "sistema_id", nullable = false)
    private Integer sistemaId;

    @Column(nullable = false, length = 80)
    private String nombre;

    @Column(length = 255)
    private String descripcion;

    @Column(nullable = false)
    private Integer nivel;

    @Column(name = "puntos_inicio", nullable = false)
    private Integer puntosInicio;

    @Column(name = "puntos_final", nullable = false)
    private Integer puntosFinal;

    @Column(nullable = false)
    private Boolean activo = true;

    // Getters/Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getSistemaId() { return sistemaId; }
    public void setSistemaId(Integer sistemaId) { this.sistemaId = sistemaId; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Integer getNivel() { return nivel; }
    public void setNivel(Integer nivel) { this.nivel = nivel; }

    public Integer getPuntosInicio() { return puntosInicio; }
    public void setPuntosInicio(Integer puntosInicio) { this.puntosInicio = puntosInicio; }

    public Integer getPuntosFinal() { return puntosFinal; }
    public void setPuntosFinal(Integer puntosFinal) { this.puntosFinal = puntosFinal; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
}
