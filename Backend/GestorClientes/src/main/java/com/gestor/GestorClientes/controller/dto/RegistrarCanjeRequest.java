package com.gestor.GestorClientes.controller.dto;

public class RegistrarCanjeRequest {
    private String playerId;
    private Integer sistemaId;
    private Integer beneficioId;
    private Integer categoriaId;

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public Integer getSistemaId() {
        return sistemaId;
    }

    public void setSistemaId(Integer sistemaId) {
        this.sistemaId = sistemaId;
    }

    public Integer getBeneficioId() {
        return beneficioId;
    }

    public void setBeneficioId(Integer beneficioId) {
        this.beneficioId = beneficioId;
    }

    public Integer getCategoriaId() { return categoriaId; }

    public void setCategoriaId(Integer categoriaId) { this.categoriaId = categoriaId; }
}
