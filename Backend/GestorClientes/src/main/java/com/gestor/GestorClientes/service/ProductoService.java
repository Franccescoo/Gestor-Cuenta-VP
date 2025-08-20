package com.gestor.GestorClientes.service;

import com.gestor.GestorClientes.controller.dto.ProductoDTO;
import com.gestor.GestorClientes.persistence.entity.ProductoEntity;
import com.gestor.GestorClientes.persistence.repositories.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;

    public List<ProductoDTO> listarProductos(Integer sistemaId, Boolean activo) {
        List<ProductoEntity> entities = productoRepository.findAllFull(sistemaId, activo);
        return entities.stream().map(this::toDTO).toList();
    }

    private ProductoDTO toDTO(ProductoEntity e) {
        return ProductoDTO.builder()
                .id(e.getId())
                .nombre(e.getNombre())
                .descripcion(e.getDescripcion())
                .puntosCanje(e.getPuntosCanje())
                .costo(e.getCosto())
                .moneda(e.getMoneda())
                .foto1(e.getFoto1())
                .foto2(e.getFoto2())
                .foto3(e.getFoto3())
                .activo(e.getActivo())
                .sistema(ProductoDTO.SistemaDTO.builder()
                        .id(e.getSistema().getId())
                        .nombre(e.getSistema().getNombre())
                        .build())
                .categoria(ProductoDTO.CategoriaDTO.builder()
                        .id(e.getCategoria().getId())
                        .nombre(e.getCategoria().getNombre())
                        .descripcion(e.getCategoria().getDescripcion())
                        .nivel(e.getCategoria().getNivel())
                        .puntosInicio(e.getCategoria().getPuntosInicio())
                        .puntosFinal(e.getCategoria().getPuntosFinal())
                        .build())
                .build();
    }
}
