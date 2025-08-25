package com.gestor.GestorClientes.service;

import com.gestor.GestorClientes.controller.dto.HistorialCanjeDetalleDTO;
import com.gestor.GestorClientes.persistence.entity.HistorialCanjeBeneficioEntity;
import com.gestor.GestorClientes.persistence.repositories.HistorialCanjeBeneficioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HistorialCanjeBeneficioService {

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

}
