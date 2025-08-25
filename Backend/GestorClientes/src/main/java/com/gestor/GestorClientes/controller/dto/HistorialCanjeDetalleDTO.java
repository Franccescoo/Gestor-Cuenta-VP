package com.gestor.GestorClientes.controller.dto;

import com.gestor.GestorClientes.persistence.entity.BeneficioEntity;
import com.gestor.GestorClientes.persistence.entity.CategoriaEntity;

import java.time.LocalDateTime;

public class HistorialCanjeDetalleDTO {
    private Long id;
    private String playerId;
    private Integer sistemaId;
    private String estado;
    private LocalDateTime fechaCanje;
    private LocalDateTime fechaRespuesta;
    private String motivoRechazo;

    private BeneficioEntity beneficio;
    private CategoriaEntity categoria;

    // constructor
    public HistorialCanjeDetalleDTO(Long id, String playerId, Integer sistemaId,
                                    String estado, LocalDateTime fechaCanje,
                                    LocalDateTime fechaRespuesta, String motivoRechazo,
                                    BeneficioEntity beneficio, CategoriaEntity categoria) {
        this.id = id;
        this.playerId = playerId;
        this.sistemaId = sistemaId;
        this.estado = estado;
        this.fechaCanje = fechaCanje;
        this.fechaRespuesta = fechaRespuesta;
        this.motivoRechazo = motivoRechazo;
        this.beneficio = beneficio;
        this.categoria = categoria;
    }

    // getters
    public Long getId() { return id; }
    public String getPlayerId() { return playerId; }
    public Integer getSistemaId() { return sistemaId; }
    public String getEstado() { return estado; }
    public LocalDateTime getFechaCanje() { return fechaCanje; }
    public LocalDateTime getFechaRespuesta() { return fechaRespuesta; }
    public String getMotivoRechazo() { return motivoRechazo; }
    public BeneficioEntity getBeneficio() { return beneficio; }
    public CategoriaEntity getCategoria() { return categoria; }
}

