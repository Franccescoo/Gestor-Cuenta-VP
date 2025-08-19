package com.gestor.GestorClientes.persistence.repositories.projections;

public interface CategoriaBeneficioRow {
    Integer getCategoriaId();
    Integer getBeneficioId();
    String  getBeneficioNombre();
    String  getBeneficioDescripcion();
}
