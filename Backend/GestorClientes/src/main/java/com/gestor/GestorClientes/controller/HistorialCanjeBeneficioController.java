package com.gestor.GestorClientes.controller;

import com.gestor.GestorClientes.controller.dto.HistorialCanjeDetalleDTO;
import com.gestor.GestorClientes.controller.dto.RegistrarCanjeRequest;
import com.gestor.GestorClientes.persistence.entity.HistorialCanjeBeneficioEntity;
import com.gestor.GestorClientes.service.HistorialCanjeBeneficioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historial-canje")
public class HistorialCanjeBeneficioController {

    private final HistorialCanjeBeneficioService service;

    public HistorialCanjeBeneficioController(HistorialCanjeBeneficioService service) {
        this.service = service;
    }

    // 1. Crear solicitud de canje
    @PostMapping("/solicitar")
    public void crearSolicitudDeCanje(@RequestBody RegistrarCanjeRequest req) {
        service.crearSolicitudDeCanje(req);
    }

    @GetMapping("/{playerId}/{sistemaId}")
    public List<HistorialCanjeBeneficioEntity> obtenerHistorial(
            @PathVariable String playerId,
            @PathVariable Integer sistemaId) {
        return service.obtenerHistorial(playerId, sistemaId);
    }

    @GetMapping("/{playerId}/{sistemaId}/detalle")
    public List<HistorialCanjeDetalleDTO> obtenerHistorialDetalle(
            @PathVariable String playerId,
            @PathVariable Integer sistemaId) {
        return service.obtenerHistorialConDetalle(playerId, sistemaId);
    }

}
