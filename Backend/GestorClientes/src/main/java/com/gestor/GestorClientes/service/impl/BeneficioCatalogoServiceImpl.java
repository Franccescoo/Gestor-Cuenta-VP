package com.gestor.GestorClientes.service.impl;

import com.gestor.GestorClientes.controller.dto.BeneficioItemDTO;
import com.gestor.GestorClientes.controller.dto.CatalogoBeneficiosDTO;
import com.gestor.GestorClientes.controller.dto.CategoriaConBeneficiosDTO;
import com.gestor.GestorClientes.persistence.entity.CategoriaEntity;
import com.gestor.GestorClientes.persistence.repositories.CategoriaBeneficioRepository;
import com.gestor.GestorClientes.persistence.repositories.CategoriaRepository;
import com.gestor.GestorClientes.persistence.repositories.projections.CategoriaBeneficioRow;
import com.gestor.GestorClientes.service.BeneficioCatalogoService;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BeneficioCatalogoServiceImpl implements BeneficioCatalogoService {

    private final CategoriaRepository categoriaRepository;
    private final CategoriaBeneficioRepository categoriaBeneficioRepository;

    public BeneficioCatalogoServiceImpl(CategoriaRepository categoriaRepository,
                                        CategoriaBeneficioRepository categoriaBeneficioRepository) {
        this.categoriaRepository = categoriaRepository;
        this.categoriaBeneficioRepository = categoriaBeneficioRepository;
    }

    @Override
    public CatalogoBeneficiosDTO getCatalogo(String playerId, Integer systemId) {

        // 1) categorías activas del sistema
        List<CategoriaEntity> categorias = categoriaRepository
                .findBySistemaIdAndActivoTrueOrderByNivelAscNombreAsc(systemId);

        // 2) filas categoría-beneficio (join nativo)
        List<CategoriaBeneficioRow> rows = categoriaBeneficioRepository.findAllRowsBySystem(systemId);

        // 3) agrupar beneficios por categoríaId
        Map<Integer, List<BeneficioItemDTO>> mapBeneficiosPorCategoria = rows.stream()
                .collect(Collectors.groupingBy(
                        CategoriaBeneficioRow::getCategoriaId,
                        Collectors.mapping(r -> new BeneficioItemDTO(
                                r.getBeneficioId(),
                                r.getBeneficioNombre(),
                                r.getBeneficioDescripcion()
                        ), Collectors.toList())
                ));

        // 4) armar DTO final
        List<CategoriaConBeneficiosDTO> payload = categorias.stream()
                .map(cat -> new CategoriaConBeneficiosDTO(
                        cat.getId(),
                        cat.getNombre(),
                        cat.getDescripcion(),
                        cat.getNivel(),
                        mapBeneficiosPorCategoria.getOrDefault(cat.getId(), Collections.emptyList())
                ))
                .collect(Collectors.toList());

        int totalBeneficios = rows.size();

        return new CatalogoBeneficiosDTO(playerId, systemId, payload, totalBeneficios);
    }
}
