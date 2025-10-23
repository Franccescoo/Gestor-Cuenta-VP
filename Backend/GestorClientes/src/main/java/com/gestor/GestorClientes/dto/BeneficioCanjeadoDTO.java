package com.gestor.GestorClientes.dto;

import java.time.LocalDateTime;

public class BeneficioCanjeadoDTO {
    private Integer beneficioId;
    private String nombreBeneficio;
    private String categoria;
    private String estado;
    private LocalDateTime fechaCanje;
    private LocalDateTime fechaDisponible;
    private Integer diasRestantes;
    private String codigoPromocion;
    private String descripcion;
    private String imagenUrl;

    // Constructores
    public BeneficioCanjeadoDTO() {}

    public BeneficioCanjeadoDTO(Integer beneficioId, String nombreBeneficio, String categoria, 
                               String estado, LocalDateTime fechaCanje, String codigoPromocion) {
        this.beneficioId = beneficioId;
        this.nombreBeneficio = nombreBeneficio;
        this.categoria = categoria;
        this.estado = estado;
        this.fechaCanje = fechaCanje;
        this.codigoPromocion = codigoPromocion;
    }

    // Getters y Setters
    public Integer getBeneficioId() {
        return beneficioId;
    }

    public void setBeneficioId(Integer beneficioId) {
        this.beneficioId = beneficioId;
    }

    public String getNombreBeneficio() {
        return nombreBeneficio;
    }

    public void setNombreBeneficio(String nombreBeneficio) {
        this.nombreBeneficio = nombreBeneficio;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDateTime getFechaCanje() {
        return fechaCanje;
    }

    public void setFechaCanje(LocalDateTime fechaCanje) {
        this.fechaCanje = fechaCanje;
    }

    public LocalDateTime getFechaDisponible() {
        return fechaDisponible;
    }

    public void setFechaDisponible(LocalDateTime fechaDisponible) {
        this.fechaDisponible = fechaDisponible;
    }

    public Integer getDiasRestantes() {
        return diasRestantes;
    }

    public void setDiasRestantes(Integer diasRestantes) {
        this.diasRestantes = diasRestantes;
    }

    public String getCodigoPromocion() {
        return codigoPromocion;
    }

    public void setCodigoPromocion(String codigoPromocion) {
        this.codigoPromocion = codigoPromocion;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }
}
