package com.gestor.GestorClientes.controller;

import com.gestor.GestorClientes.controller.dto.SolicitudCambioPerfilDTO;
import com.gestor.GestorClientes.persistence.entity.SolicitudCambioPerfil;
import com.gestor.GestorClientes.service.SolicitudCambioPerfilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/solicitudes-cambio")
@CrossOrigin(origins = "*")
public class AdminSolicitudCambioController {

    @Autowired
    private SolicitudCambioPerfilService solicitudService;

    /**
     * Obtener todas las solicitudes de cambio pendientes
     */
    @GetMapping("/pendientes")
    public ResponseEntity<List<SolicitudCambioPerfilDTO>> obtenerSolicitudesPendientes() {
        try {
            List<SolicitudCambioPerfilDTO> solicitudes = solicitudService.obtenerSolicitudesPendientes();
            return ResponseEntity.ok(solicitudes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener todas las solicitudes de cambio (todas las estados)
     */
    @GetMapping("/todas")
    public ResponseEntity<List<SolicitudCambioPerfilDTO>> obtenerTodasLasSolicitudes() {
        try {
            List<SolicitudCambioPerfilDTO> solicitudes = solicitudService.obtenerTodasLasSolicitudes();
            return ResponseEntity.ok(solicitudes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener solicitudes por estado
     */
    @GetMapping("/por-estado/{estado}")
    public ResponseEntity<List<SolicitudCambioPerfilDTO>> obtenerSolicitudesPorEstado(
            @PathVariable String estado) {
        try {
            SolicitudCambioPerfil.EstadoSolicitud estadoEnum = SolicitudCambioPerfil.EstadoSolicitud.valueOf(estado.toUpperCase());
            List<SolicitudCambioPerfilDTO> solicitudes = solicitudService.obtenerSolicitudesPorEstado(estadoEnum);
            return ResponseEntity.ok(solicitudes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Aprobar una solicitud de cambio
     */
    @PostMapping("/{id}/aprobar")
    public ResponseEntity<Map<String, String>> aprobarSolicitud(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> comentarios) {
        try {
            String comentariosAdmin = comentarios != null ? comentarios.get("comentariosAdmin") : "";
            boolean resultado = solicitudService.aprobarSolicitud(id, comentariosAdmin);
            
            if (resultado) {
                return ResponseEntity.ok(Map.of("mensaje", "Solicitud aprobada correctamente"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "No se pudo aprobar la solicitud"));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error interno del servidor"));
        }
    }

    /**
     * Rechazar una solicitud de cambio
     */
    @PostMapping("/{id}/rechazar")
    public ResponseEntity<Map<String, String>> rechazarSolicitud(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> comentarios) {
        try {
            String comentariosAdmin = comentarios != null ? comentarios.get("comentariosAdmin") : "";
            boolean resultado = solicitudService.rechazarSolicitud(id, comentariosAdmin);
            
            if (resultado) {
                return ResponseEntity.ok(Map.of("mensaje", "Solicitud rechazada correctamente"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "No se pudo rechazar la solicitud"));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error interno del servidor"));
        }
    }

    /**
     * Obtener detalles de una solicitud específica
     */
    @GetMapping("/{id}")
    public ResponseEntity<SolicitudCambioPerfilDTO> obtenerSolicitudPorId(@PathVariable Long id) {
        try {
            SolicitudCambioPerfilDTO solicitud = solicitudService.obtenerSolicitudPorId(id);
            if (solicitud != null) {
                return ResponseEntity.ok(solicitud);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener estadísticas de solicitudes
     */
    @GetMapping("/estadisticas")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas() {
        try {
            Map<String, Object> estadisticas = solicitudService.obtenerEstadisticasSolicitudes();
            return ResponseEntity.ok(estadisticas);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Endpoint de debug para verificar el estado de un usuario
     */
    @GetMapping("/debug/usuario/{playerId}/{sistemaId}")
    public ResponseEntity<Map<String, Object>> debugUsuario(
            @PathVariable String playerId, 
            @PathVariable Integer sistemaId) {
        return solicitudService.debugUsuario(playerId, sistemaId);
    }
}
