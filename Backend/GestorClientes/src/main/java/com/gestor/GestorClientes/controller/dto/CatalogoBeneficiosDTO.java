package com.gestor.GestorClientes.controller.dto;

import java.util.List;

public class CatalogoBeneficiosDTO {
    private String playerId;
    private Integer systemId;
    private List<CategoriaConBeneficiosDTO> categorias;
    private Integer totalBeneficios;

    public CatalogoBeneficiosDTO() {}

    public CatalogoBeneficiosDTO(String playerId, Integer systemId, List<CategoriaConBeneficiosDTO> categorias, Integer totalBeneficios) {
        this.playerId = playerId;
        this.systemId = systemId;
        this.categorias = categorias;
        this.totalBeneficios = totalBeneficios;
    }

    public String getPlayerId() { return playerId; }
    public Integer getSystemId() { return systemId; }
    public List<CategoriaConBeneficiosDTO> getCategorias() { return categorias; }
    public Integer getTotalBeneficios() { return totalBeneficios; }

    public void setPlayerId(String playerId) { this.playerId = playerId; }
    public void setSystemId(Integer systemId) { this.systemId = systemId; }
    public void setCategorias(List<CategoriaConBeneficiosDTO> categorias) { this.categorias = categorias; }
    public void setTotalBeneficios(Integer totalBeneficios) { this.totalBeneficios = totalBeneficios; }
}
