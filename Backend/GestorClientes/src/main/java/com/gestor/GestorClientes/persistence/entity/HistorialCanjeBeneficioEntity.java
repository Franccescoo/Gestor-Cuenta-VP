package com.gestor.GestorClientes.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historial_canje_beneficio")
public class HistorialCanjeBeneficioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "player_id", nullable = false)
    private String playerId;

    @Column(name = "sistema_id", nullable = false)
    private Integer sistemaId;

    @Column(name = "beneficio_id")
    private Integer beneficioId;

    @Column(name = "fecha_canje")
    private LocalDateTime fechaCanje;

    @Column(name = "estado")
    private String estado;

    @Column(name = "fecha_respuesta")
    private LocalDateTime fechaRespuesta;

    @Column(name = "motivo_rechazo")
    private String motivoRechazo;

    @Column(name = "admin_id")
    private Integer adminId;

    @Column(name = "categoria_id")
    private Integer categoriaId;

    // ===== Getters y Setters =====

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDateTime getFechaCanje() {
        return fechaCanje;
    }

    public void setFechaCanje(LocalDateTime fechaCanje) {
        this.fechaCanje = fechaCanje;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDateTime getFechaRespuesta() {
        return fechaRespuesta;
    }

    public void setFechaRespuesta(LocalDateTime fechaRespuesta) {
        this.fechaRespuesta = fechaRespuesta;
    }

    public String getMotivoRechazo() {
        return motivoRechazo;
    }

    public void setMotivoRechazo(String motivoRechazo) {
        this.motivoRechazo = motivoRechazo;
    }

    public Integer getAdminId() {
        return adminId;
    }

    public void setAdminId(Integer adminId) {
        this.adminId = adminId;
    }

    public Integer getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Integer categoriaId) {
        this.categoriaId = categoriaId;
    }
}
