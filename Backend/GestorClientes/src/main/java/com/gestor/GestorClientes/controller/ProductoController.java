package com.gestor.GestorClientes.controller;

import com.gestor.GestorClientes.controller.dto.ProductoDTO;
import com.gestor.GestorClientes.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
@CrossOrigin // ajusta origins si necesitas
public class ProductoController {

    private final ProductoService productoService;

    /**
     * GET /api/productos?sistemaId=1&activo=true
     * Todos los productos con sistema y categoria anidados.
     */
    @GetMapping
    public List<ProductoDTO> getProductos(
            @RequestParam(required = false) Integer sistemaId,
            @RequestParam(required = false) Boolean activo
    ) {
        return productoService.listarProductos(sistemaId, activo);
    }
}
