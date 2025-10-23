package com.gestor.GestorClientes.controller;

import com.gestor.GestorClientes.dto.BeneficioCanjeadoDTO;
import com.gestor.GestorClientes.dto.DetalleBeneficioCanjeadoDTO;
import com.gestor.GestorClientes.service.MobileBeneficiosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mobile/beneficios")
@CrossOrigin(origins = "*")
public class MobileBeneficiosController {

    @Autowired
    private MobileBeneficiosService mobileBeneficiosService;

    /**
     * Obtener beneficios canjeados del usuario autenticado
     * Solo muestra beneficios con estado APROBADO
     */
    @GetMapping("/canjeados")
    public ResponseEntity<List<BeneficioCanjeadoDTO>> getBeneficiosCanjeados(
            @RequestParam String playerId,
            @RequestParam Integer sistemaId) {
        try {
            List<BeneficioCanjeadoDTO> beneficios = mobileBeneficiosService
                .obtenerBeneficiosCanjeados(playerId, sistemaId);
            return ResponseEntity.ok(beneficios);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtener detalle de un beneficio canjeado específico
     * Incluye código de promoción y fecha de disponibilidad
     */
    @GetMapping("/canjeados/{beneficioId}/detalle")
    public ResponseEntity<DetalleBeneficioCanjeadoDTO> getDetalleBeneficio(
            @PathVariable Integer beneficioId,
            @RequestParam String playerId,
            @RequestParam Integer sistemaId) {
        try {
            DetalleBeneficioCanjeadoDTO detalle = mobileBeneficiosService
                .obtenerDetalleBeneficioCanjeado(beneficioId, playerId, sistemaId);
            return ResponseEntity.ok(detalle);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtener beneficios disponibles para canjear
     * Muestra beneficios que el usuario puede canjear según su nivel
     */
    @GetMapping("/disponibles")
    public ResponseEntity<List<BeneficioCanjeadoDTO>> getBeneficiosDisponibles(
            @RequestParam String playerId,
            @RequestParam Integer sistemaId) {
        try {
            List<BeneficioCanjeadoDTO> beneficios = mobileBeneficiosService
                .obtenerBeneficiosDisponibles(playerId, sistemaId);
            return ResponseEntity.ok(beneficios);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
