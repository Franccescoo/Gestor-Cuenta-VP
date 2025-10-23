package com.gestor.GestorClientes.dto;

import java.time.LocalDateTime;

public class DetalleBeneficioCanjeadoDTO {
    private Integer beneficioId;
    private String nombreBeneficio;
    private String categoria;
    private String descripcion;
    private String codigoPromocion;
    private String estado;
    private LocalDateTime fechaCanje;
    private LocalDateTime fechaDisponible;
    private Integer diasRestantes;
    private String imagenUrl;
    private String instruccionesUso;
    private String terminosCondiciones;
    private String tiendaAplicable;
    private String contacto;

    // Constructores
    public DetalleBeneficioCanjeadoDTO() {}

    public DetalleBeneficioCanjeadoDTO(Integer beneficioId, String nombreBeneficio, 
                                     String categoria, String codigoPromocion) {
        this.beneficioId = beneficioId;
        this.nombreBeneficio = nombreBeneficio;
        this.categoria = categoria;
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

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getCodigoPromocion() {
        return codigoPromocion;
    }

    public void setCodigoPromocion(String codigoPromocion) {
        this.codigoPromocion = codigoPromocion;
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

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public String getInstruccionesUso() {
        return instruccionesUso;
    }

    public void setInstruccionesUso(String instruccionesUso) {
        this.instruccionesUso = instruccionesUso;
    }

    public String getTerminosCondiciones() {
        return terminosCondiciones;
    }

    public void setTerminosCondiciones(String terminosCondiciones) {
        this.terminosCondiciones = terminosCondiciones;
    }

    public String getTiendaAplicable() {
        return tiendaAplicable;
    }

    public void setTiendaAplicable(String tiendaAplicable) {
        this.tiendaAplicable = tiendaAplicable;
    }

    public String getContacto() {
        return contacto;
    }

    public void setContacto(String contacto) {
        this.contacto = contacto;
    }
}
