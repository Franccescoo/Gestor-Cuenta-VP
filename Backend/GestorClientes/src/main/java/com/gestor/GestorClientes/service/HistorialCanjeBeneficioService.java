package com.gestor.GestorClientes.service;

import com.gestor.GestorClientes.controller.dto.HistorialCanjeDetalleDTO;
import com.gestor.GestorClientes.controller.dto.RegistrarCanjeRequest;
import com.gestor.GestorClientes.persistence.entity.HistorialCanjeBeneficioEntity;
import com.gestor.GestorClientes.persistence.repositories.HistorialCanjeBeneficioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class HistorialCanjeBeneficioService {

    private static final int DIAS_ENTRE_CANJEOS = 30;

    private final HistorialCanjeBeneficioRepository repository;

    public HistorialCanjeBeneficioService(HistorialCanjeBeneficioRepository repository) {
        this.repository = repository;
    }

    public List<HistorialCanjeBeneficioEntity> obtenerHistorial(String playerId, Integer sistemaId) {
        return repository.findByPlayerIdAndSistemaId(playerId, sistemaId);
    }

    public List<HistorialCanjeDetalleDTO> obtenerHistorialConDetalle(String playerId, Integer sistemaId) {
        return repository.findHistorialConDetalle(playerId, sistemaId);
    }

    // 1. Crear solicitud de canje (PENDIENTE)
    public void crearSolicitudDeCanje(RegistrarCanjeRequest req) {
        // Antes de crear la solicitud, verifica que no haya una pendiente para este beneficio
        boolean yaHayPendiente = repository.findByPlayerIdAndSistemaIdAndBeneficioIdAndEstado(
                req.getPlayerId(), req.getSistemaId(), req.getBeneficioId(), "PENDIENTE"
        ).size() > 0;

        if (yaHayPendiente) {
            throw new RuntimeException("Ya existe una solicitud pendiente para este beneficio.");
        }

        // Verifica si puede canjear según últimas solicitudes APROBADAS
        if (!puedeCanjear(req.getPlayerId(), req.getSistemaId(), req.getBeneficioId())) {
            throw new RuntimeException("Debes esperar para volver a canjear este beneficio.");
        }

        HistorialCanjeBeneficioEntity solicitud = new HistorialCanjeBeneficioEntity(
                req.getPlayerId(),
                req.getSistemaId(),
                req.getBeneficioId(),
                req.getCategoriaId(),
                LocalDateTime.now(),
                "PENDIENTE"
        );
        repository.save(solicitud);
    }

    // 2. Verificar si puede canjear (solo los APROBADOS cuentan para el periodo)
    public boolean puedeCanjear(String playerId, Integer sistemaId, Integer beneficioId) {
        Optional<HistorialCanjeBeneficioEntity> ultimoAprobado = repository
                .findTopByPlayerIdAndSistemaIdAndBeneficioIdAndEstadoOrderByFechaCanjeDesc(
                        playerId, sistemaId, beneficioId, "APROBADO"
                );

        if (ultimoAprobado.isEmpty() || ultimoAprobado.get().getFechaCanje() == null) {
            return true;
        }

        LocalDateTime hace30dias = LocalDateTime.now().minusDays(30);
        return ultimoAprobado.get().getFechaCanje().isBefore(hace30dias);
    }


}
