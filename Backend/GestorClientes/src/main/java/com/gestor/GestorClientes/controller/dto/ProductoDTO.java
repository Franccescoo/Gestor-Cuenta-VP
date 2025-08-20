package com.gestor.GestorClientes.controller.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductoDTO {
    private Long id;

    private String nombre;
    private String descripcion;
    private Integer puntosCanje;
    private BigDecimal costo;
    private String moneda;
    private String foto1;
    private String foto2;
    private String foto3;
    private Boolean activo;

    private SistemaDTO sistema;
    private CategoriaDTO categoria;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class SistemaDTO {
        private Integer id;
        private String nombre;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CategoriaDTO {
        private Integer id;
        private String nombre;
        private String descripcion;
        private Integer nivel;
        private Integer puntosInicio;
        private Integer puntosFinal;
    }
}
