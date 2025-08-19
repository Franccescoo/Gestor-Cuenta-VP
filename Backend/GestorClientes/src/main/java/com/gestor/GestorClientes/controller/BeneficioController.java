package com.gestor.GestorClientes.controller;

import com.gestor.GestorClientes.controller.dto.CatalogoBeneficiosDTO;
import com.gestor.GestorClientes.service.BeneficioCatalogoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/beneficio")
public class BeneficioController {

    private final BeneficioCatalogoService catalogoService;

    public BeneficioController(BeneficioCatalogoService catalogoService) {
        this.catalogoService = catalogoService;
    }

    // GET /api/players/{playerId}/systems/{systemId}/beneficios/catalogo
    @GetMapping("/players/{playerId}/systems/{systemId}/beneficios/catalogo")
    public ResponseEntity<CatalogoBeneficiosDTO> getCatalogo(
            @PathVariable String playerId,
            @PathVariable Integer systemId
    ) {
        return ResponseEntity.ok(catalogoService.getCatalogo(playerId, systemId));
    }
}
