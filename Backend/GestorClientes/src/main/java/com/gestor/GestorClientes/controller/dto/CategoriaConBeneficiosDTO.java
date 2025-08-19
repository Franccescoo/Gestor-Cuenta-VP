package com.gestor.GestorClientes.controller.dto;

import java.util.List;

public class CategoriaConBeneficiosDTO {
    private Integer id;
    private String nombre;
    private String descripcion;
    private Integer nivel;
    private List<BeneficioItemDTO> beneficios;

    public CategoriaConBeneficiosDTO() {}

    public CategoriaConBeneficiosDTO(Integer id, String nombre, String descripcion, Integer nivel, List<BeneficioItemDTO> beneficios) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.nivel = nivel;
        this.beneficios = beneficios;
    }

    public Integer getId() { return id; }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }
    public Integer getNivel() { return nivel; }
    public List<BeneficioItemDTO> getBeneficios() { return beneficios; }

    public void setId(Integer id) { this.id = id; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public void setNivel(Integer nivel) { this.nivel = nivel; }
    public void setBeneficios(List<BeneficioItemDTO> beneficios) { this.beneficios = beneficios; }
}
