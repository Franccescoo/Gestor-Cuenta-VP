package com.gestor.GestorClientes.service;

import com.gestor.GestorClientes.controller.dto.CatalogoBeneficiosDTO;

public interface BeneficioCatalogoService {
    CatalogoBeneficiosDTO getCatalogo(String playerId, Integer systemId);
}
