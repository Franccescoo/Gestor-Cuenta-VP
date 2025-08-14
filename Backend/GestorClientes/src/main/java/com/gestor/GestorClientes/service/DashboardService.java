// src/main/java/com/gestor/GestorClientes/service/DashboardService.java
package com.gestor.GestorClientes.service;

import com.gestor.GestorClientes.controller.dto.BeneficioDTO;
import com.gestor.GestorClientes.controller.dto.UserDashboardDTO;
import com.gestor.GestorClientes.persistence.entity.CategoriaEntity;
import com.gestor.GestorClientes.persistence.repositories.CategoriaBeneficioRepository;
import com.gestor.GestorClientes.persistence.repositories.CategoriaRepository;
import com.gestor.GestorClientes.persistence.repositories.UserRepository;
import com.gestor.GestorClientes.persistence.repositories.projections.UserDashProjection;
import com.gestor.GestorClientes.util.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final UserRepository userRepo;
    private final CategoriaRepository catRepo;
    private final CategoriaBeneficioRepository catBenRepo;

    public DashboardService(UserRepository userRepo,
                            CategoriaRepository catRepo,
                            CategoriaBeneficioRepository catBenRepo) {
        this.userRepo = userRepo;
        this.catRepo = catRepo;
        this.catBenRepo = catBenRepo;
    }

    // DashboardService.java
    public List<BeneficioDTO> beneficiosByPlayerAndSistema(String playerId, Integer rolId) {
        var v = userRepo.findByPlayerIdAndRolId(playerId, rolId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuario no encontrado: playerId=%s, rolId=%s".formatted(playerId, rolId)));

        int puntos = Optional.ofNullable(v.getPuntosTotal()).orElse(0);
        var actual = resolveCategoriaActual(v.getCategoriaId(), v.getRolId(), puntos);

        // Opción B: el repo ya devuelve List<BeneficioDTO>
        return catBenRepo.findBeneficiosDTOBySistemaAndCategoria(rolId, actual.getId());
    }


    // --- Dashboard por playerId + sistema (rol) ---
    public UserDashboardDTO byPlayerAndSistema(String playerId, Integer rolId) {
        UserDashProjection v = userRepo.findByPlayerIdAndRolId(playerId, rolId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuario no encontrado: playerId=%s, rolId=%s".formatted(playerId, rolId)));
        return buildFromProjection(v);
    }

    // --- Último registro por playerId (si no pasas rolId) ---
    public UserDashboardDTO byPlayerLatest(String playerId) {
        UserDashProjection v = userRepo
                .findTopByPlayerIdOrderByFechaUltimaActualizacionDesc(playerId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: playerId=" + playerId));
        return buildFromProjection(v);
    }

    /**
     * Reglas para el dashboard:
     * - Si categoria_id es NULL → nivel/metaNivel/puntosFaltantes/progreso = null (no inferir).
     * - Si existe categoría:
     *     metaNivel       = categoria.puntos_final
     *     puntosFaltantes = max(0, puntos_final - puntos_total_usuario)
     *     progreso        = round( (puntos_total / puntos_final) * 100 ) limitado a [0, 100]
     *     nivel           = categoria.nombre
     */
    private UserDashboardDTO buildFromProjection(UserDashProjection v) {
        Integer puntos = Optional.ofNullable(v.getPuntosTotal()).orElse(0);

        String  nivel = null;
        Integer metaNivel = null;
        Integer faltantes = null;
        Integer progreso = null;

        if (v.getCategoriaId() != null) {
            Optional<CategoriaEntity> catOpt = catRepo.findByIdAndSistemaId(v.getCategoriaId(), v.getRolId());
            if (catOpt.isPresent()) {
                CategoriaEntity cat = catOpt.get();
                nivel = cat.getNombre(); // puede ser null
                Integer puntosFinal = cat.getPuntosFinal();

                metaNivel = puntosFinal;
                if (puntosFinal != null) {
                    faltantes = Math.max(0, puntosFinal - puntos);
                    if (puntosFinal > 0) {
                        int p = (int) Math.round((puntos * 100.0) / puntosFinal);
                        progreso = Math.max(0, Math.min(100, p));
                    } else {
                        progreso = 0;
                    }
                }
            }
        }

        return new UserDashboardDTO(
                v.getPlayerId(),
                v.getRolId(),
                v.getNombreCompleto(),
                v.getEmail(),
                puntos,
                nivel,
                metaNivel,
                faltantes,
                progreso,
                v.getFechaUltimaActualizacion()
        );
    }

    /**
     * Usado para beneficios:
     * - Si categoriaId viene → se usa esa.
     * - Si viene null → se infiere por rango (puntos_inicio ≤ puntos < puntos_final) dentro del sistema.
     */
    private CategoriaEntity resolveCategoriaActual(Integer categoriaId, Integer sistemaId, Integer puntos) {
        if (sistemaId == null) {
            throw new ResourceNotFoundException("sistema_id (rolId) null en el registro de puntos");
        }

        if (categoriaId != null) {
            return catRepo.findByIdAndSistemaId(categoriaId, sistemaId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Categoría no encontrada: id=%s, sistema=%s".formatted(categoriaId, sistemaId)));
        }

        // Inferir por rango [puntos_inicio, puntos_final) (o inclusivo en el límite, según tengas datos)
        return catRepo
                .findFirstBySistemaIdAndPuntosInicioLessThanEqualAndPuntosFinalGreaterThan(sistemaId, puntos, puntos)
                .or(() -> catRepo.findFirstBySistemaIdAndPuntosInicioLessThanEqualAndPuntosFinalGreaterThanEqual(sistemaId, puntos, puntos))
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se pudo inferir categoría para sistema=%s y puntos=%s".formatted(sistemaId, puntos)));
    }
}
