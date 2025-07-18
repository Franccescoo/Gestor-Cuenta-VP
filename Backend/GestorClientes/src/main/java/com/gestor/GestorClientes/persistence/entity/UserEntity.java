package com.gestor.GestorClientes.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "puntos_acumulados")
public class UserEntity {

    @Id
    @Column(name = "player_id")
    private String playerId;

    @Column(name = "usuarios", nullable = false, unique = true)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "email")
    private String email;

    @Column(name = "celular")
    private String celular;

    @Column(name = "login")
    private String login;

    @Column(name = "numero_documento")
    private String numeroDocumento;

    @Column(name = "nombre_completo")
    private String nombreCompleto;

    @Column(name = "apellido_completo")
    private String apellidoCompleto;

    @Column(name = "fecha_cumpleanos")
    private LocalDate fechaCumpleanos;

    @Column(name = "puntos_total")
    private Integer puntosTotal;

    @Column(name = "fecha_ultima_actualizacion")
    private LocalDate fechaUltimaActualizacion;

    @Column(name = "sistema_id")
    private Integer rolId; // antes era sistemaId

    @Column(name = "verificado")
    private Boolean verificado;

    @Column(name = "activo")
    private Boolean activo;

    @Column(name = "categoria_id")
    private Integer categoriaId;

    // Getters y Setters

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCelular() {
        return celular;
    }

    public void setCelular(String celular) {
        this.celular = celular;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getNumeroDocumento() {
        return numeroDocumento;
    }

    public void setNumeroDocumento(String numeroDocumento) {
        this.numeroDocumento = numeroDocumento;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getApellidoCompleto() {
        return apellidoCompleto;
    }

    public void setApellidoCompleto(String apellidoCompleto) {
        this.apellidoCompleto = apellidoCompleto;
    }

    public LocalDate getFechaCumpleanos() {
        return fechaCumpleanos;
    }

    public void setFechaCumpleanos(LocalDate fechaCumpleanos) {
        this.fechaCumpleanos = fechaCumpleanos;
    }

    public Integer getPuntosTotal() {
        return puntosTotal;
    }

    public void setPuntosTotal(Integer puntosTotal) {
        this.puntosTotal = puntosTotal;
    }

    public LocalDate getFechaUltimaActualizacion() {
        return fechaUltimaActualizacion;
    }

    public void setFechaUltimaActualizacion(LocalDate fechaUltimaActualizacion) {
        this.fechaUltimaActualizacion = fechaUltimaActualizacion;
    }

    public Integer getRolId() {
        return rolId;
    }

    public void setRolId(Integer rolId) {
        this.rolId = rolId;
    }

    public Boolean getVerificado() {
        return verificado;
    }

    public void setVerificado(Boolean verificado) {
        this.verificado = verificado;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public Integer getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Integer categoriaId) {
        this.categoriaId = categoriaId;
    }
}
