package com.gestor.GestorClientes.controller.dto;

public class BeneficioItemDTO {
    private Integer id;
    private String nombre;
    private String descripcion;

    public BeneficioItemDTO() {}

    public BeneficioItemDTO(Integer id, String nombre, String descripcion) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    public Integer getId() { return id; }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }

    public void setId(Integer id) { this.id = id; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
