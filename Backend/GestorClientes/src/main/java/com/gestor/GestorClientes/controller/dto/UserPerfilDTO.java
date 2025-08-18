package com.gestor.GestorClientes.controller.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

import java.time.LocalDate;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class UserPerfilDTO {

    // Clave compuesta
    private String playerId;
    /** Mapea a rolId en la entidad (sistema_id en BD) */
    private Integer sistemaId;

    // Principales
    private Integer puntosTotal;

    /** En tu entidad es LocalDate; si luego lo cambias a LocalDateTime, actualiza este formato */
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaUltimaActualizacion;

    // Identidad
    private String nombreCompleto;
    private String apellidoCompleto;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaCumpleanos;

    // Contacto
    private String email;
    private String celular;
    private String login;

    // Documento
    private String tipoDocumento;
    private String numeroDocumento;

    // Flags / otros
    private Boolean verificado;
    private Boolean activo;

    private Integer categoriaId;
    /** Opcional: si luego consultamos la tabla categoria */
    private String categoriaNombre;

    /** Columna 'usuarios' en tu tabla (username) */
    private String usuarios;
}
