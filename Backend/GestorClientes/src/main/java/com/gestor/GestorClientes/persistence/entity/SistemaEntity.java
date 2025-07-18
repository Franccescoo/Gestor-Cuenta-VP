package com.gestor.GestorClientes.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tabla_sistema")
public class SistemaEntity {

    @Id
    private Integer id;

    private String nombre;

    private Boolean activo;

    // Getters y Setters
    public Integer getId() { return id; }

    public void setId(Integer id) { this.id = id; }

    public String getNombre() { return nombre; }

    public void setNombre(String nombre) { this.nombre = nombre; }

    public Boolean getActivo() { return activo; }

    public void setActivo(Boolean activo) { this.activo = activo; }
}
