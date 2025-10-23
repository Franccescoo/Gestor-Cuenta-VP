package com.gestor.GestorClientes.service;

import com.gestor.GestorClientes.dto.BeneficioCanjeadoDTO;
import com.gestor.GestorClientes.dto.DetalleBeneficioCanjeadoDTO;
import com.gestor.GestorClientes.persistence.entity.HistorialCanjeBeneficioEntity;
import com.gestor.GestorClientes.persistence.repositories.HistorialCanjeBeneficioRepository;
import com.gestor.GestorClientes.persistence.repositories.BeneficioRepository;
import com.gestor.GestorClientes.persistence.repositories.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MobileBeneficiosService {

    @Autowired
    private HistorialCanjeBeneficioRepository historialRepository;

    @Autowired
    private BeneficioRepository beneficioRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    private static final int DIAS_COOLDOWN = 30;

    /**
     * Obtener beneficios canjeados del usuario (solo APROBADOS)
     */
    public List<BeneficioCanjeadoDTO> obtenerBeneficiosCanjeados(String playerId, Integer sistemaId) {
        List<HistorialCanjeBeneficioEntity> canjes = historialRepository
            .findByPlayerIdAndSistemaId(playerId, sistemaId);

        // Filtrar solo los aprobados
        return canjes.stream()
            .filter(canje -> "APROBADO".equals(canje.getEstado()))
            .map(this::convertirABeneficioCanjeadoDTO)
            .collect(Collectors.toList());
    }

    /**
     * Obtener detalle completo de un beneficio canjeado
     */
    public DetalleBeneficioCanjeadoDTO obtenerDetalleBeneficioCanjeado(
            Integer beneficioId, String playerId, Integer sistemaId) {
        
        List<HistorialCanjeBeneficioEntity> canjes = historialRepository
            .findByPlayerIdAndSistemaId(playerId, sistemaId);
        
        HistorialCanjeBeneficioEntity canje = canjes.stream()
            .filter(c -> c.getBeneficioId().equals(beneficioId) && "APROBADO".equals(c.getEstado()))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Beneficio no encontrado"));

        return convertirADetalleDTO(canje);
    }

    /**
     * Obtener beneficios disponibles para canjear
     */
    public List<BeneficioCanjeadoDTO> obtenerBeneficiosDisponibles(String playerId, Integer sistemaId) {
        // Aquí implementarías la lógica para obtener beneficios disponibles
        // basándose en el nivel del usuario y beneficios no canjeados recientemente
        return List.of(); // Placeholder por ahora
    }

    /**
     * Convertir entidad a DTO de beneficio canjeado
     */
    private BeneficioCanjeadoDTO convertirABeneficioCanjeadoDTO(HistorialCanjeBeneficioEntity canje) {
        BeneficioCanjeadoDTO dto = new BeneficioCanjeadoDTO();
        
        dto.setBeneficioId(canje.getBeneficioId());
        dto.setEstado(canje.getEstado());
        dto.setFechaCanje(canje.getFechaCanje());
        
        // Calcular fecha disponible (30 días después del canje)
        LocalDateTime fechaDisponible = canje.getFechaCanje().plusDays(DIAS_COOLDOWN);
        dto.setFechaDisponible(fechaDisponible);
        
        // Calcular días restantes
        long diasRestantes = ChronoUnit.DAYS.between(LocalDateTime.now(), fechaDisponible);
        dto.setDiasRestantes((int) Math.max(0, diasRestantes));
        
        // Generar código de promoción único
        dto.setCodigoPromocion(generarCodigoPromocion(canje));
        
        // Obtener información del beneficio y categoría
        // (Esto requeriría joins adicionales en el repositorio)
        dto.setNombreBeneficio("Beneficio " + canje.getBeneficioId());
        dto.setCategoria("Categoría " + canje.getCategoriaId());
        
        return dto;
    }

    /**
     * Convertir entidad a DTO de detalle
     */
    private DetalleBeneficioCanjeadoDTO convertirADetalleDTO(HistorialCanjeBeneficioEntity canje) {
        DetalleBeneficioCanjeadoDTO dto = new DetalleBeneficioCanjeadoDTO();
        
        dto.setBeneficioId(canje.getBeneficioId());
        dto.setEstado(canje.getEstado());
        dto.setFechaCanje(canje.getFechaCanje());
        
        // Calcular fecha disponible
        LocalDateTime fechaDisponible = canje.getFechaCanje().plusDays(DIAS_COOLDOWN);
        dto.setFechaDisponible(fechaDisponible);
        
        // Calcular días restantes
        long diasRestantes = ChronoUnit.DAYS.between(LocalDateTime.now(), fechaDisponible);
        dto.setDiasRestantes((int) Math.max(0, diasRestantes));
        
        // Generar código de promoción
        dto.setCodigoPromocion(generarCodigoPromocion(canje));
        
        // Información adicional
        dto.setNombreBeneficio("Beneficio " + canje.getBeneficioId());
        dto.setCategoria("Categoría " + canje.getCategoriaId());
        dto.setDescripcion("Descripción del beneficio canjeado");
        dto.setInstruccionesUso("Presenta este código en la tienda para canjear tu beneficio");
        dto.setTerminosCondiciones("Válido por 30 días desde la fecha de canje");
        dto.setTiendaAplicable("Tienda Prestige Club");
        dto.setContacto("Contacto: info@prestigeclub.vip");
        
        return dto;
    }

    /**
     * Generar código de promoción único
     */
    private String generarCodigoPromocion(HistorialCanjeBeneficioEntity canje) {
        // Generar código basado en el ID del canje y fecha
        String base = "PC" + canje.getId() + canje.getFechaCanje().getDayOfYear();
        return base.toUpperCase();
    }
}
