// src/main/java/com/gestor/GestorClientes/controller/DashboardController.java
package com.gestor.GestorClientes.controller;

import com.gestor.GestorClientes.controller.dto.BeneficioDTO;
import com.gestor.GestorClientes.controller.dto.UserDashboardDTO;
import com.gestor.GestorClientes.service.DashboardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DashboardController {
    private final DashboardService service;

    public DashboardController(DashboardService service) {
        this.service = service;
    }

    @GetMapping("/players/{playerId}/systems/{rolId}/dashboard")
    public UserDashboardDTO byPlayerAndSistema(@PathVariable String playerId, @PathVariable Integer rolId) {
        return service.byPlayerAndSistema(playerId, rolId);
    }

    @GetMapping("/players/{playerId}/systems/{rolId}/beneficios")
    public List<BeneficioDTO> beneficios(@PathVariable String playerId, @PathVariable Integer rolId) {
        return service.beneficiosByPlayerAndSistema(playerId, rolId);
    }
}
