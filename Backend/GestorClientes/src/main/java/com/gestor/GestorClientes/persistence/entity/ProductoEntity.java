package com.gestor.GestorClientes.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "producto")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK a sistema
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sistema_id", nullable = false)
    private SistemaEntity sistema;

    // FK a categoria
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id", nullable = false)
    private CategoriaEntity categoria;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(columnDefinition = "text")
    private String descripcion;

    @Column(name = "puntos_canje")
    private Integer puntosCanje;

    @Column(precision = 12, scale = 2)
    private BigDecimal costo;

    @Column(length = 10)
    private String moneda;

    @Column(columnDefinition = "text")
    private String foto1;

    @Column(columnDefinition = "text")
    private String foto2;

    @Column(columnDefinition = "text")
    private String foto3;

    private Boolean activo;
}

