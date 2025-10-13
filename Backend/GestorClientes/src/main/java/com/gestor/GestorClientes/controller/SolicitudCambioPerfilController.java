package com.gestor.GestorClientes.controller;

import com.gestor.GestorClientes.controller.dto.CrearSolicitudRequest;
import com.gestor.GestorClientes.controller.dto.SolicitudCambioPerfilDTO;
import com.gestor.GestorClientes.service.SolicitudCambioPerfilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/solicitudes-perfil")
public class SolicitudCambioPerfilController {

    @Autowired
    private SolicitudCambioPerfilService solicitudService;

    /**
     * Crear una nueva solicitud de cambio de perfil
     */
    @PostMapping
    public ResponseEntity<SolicitudCambioPerfilDTO> crearSolicitud(@RequestBody CrearSolicitudRequest request) {
        SolicitudCambioPerfilDTO solicitud = solicitudService.crearSolicitud(request);
        return ResponseEntity.ok(solicitud);
    }

    /**
     * Obtener solicitudes de un usuario específico
     */
    @GetMapping("/usuario")
    public ResponseEntity<List<SolicitudCambioPerfilDTO>> obtenerSolicitudesUsuario(
            @RequestParam String playerId,
            @RequestParam Integer sistemaId) {
        List<SolicitudCambioPerfilDTO> solicitudes = solicitudService.obtenerSolicitudesUsuario(playerId, sistemaId);
        return ResponseEntity.ok(solicitudes);
    }

    /**
     * Obtener una solicitud específica del usuario
     */
    @GetMapping("/{solicitudId}")
    public ResponseEntity<SolicitudCambioPerfilDTO> obtenerSolicitud(
            @PathVariable Long solicitudId,
            @RequestParam String playerId,
            @RequestParam Integer sistemaId) {
        SolicitudCambioPerfilDTO solicitud = solicitudService.obtenerSolicitud(solicitudId, playerId, sistemaId);
        return ResponseEntity.ok(solicitud);
    }

    /**
     * Obtener todas las solicitudes (para administradores)
     */
    @GetMapping("/admin/todas")
    public ResponseEntity<List<SolicitudCambioPerfilDTO>> obtenerTodasLasSolicitudes() {
        List<SolicitudCambioPerfilDTO> solicitudes = solicitudService.obtenerTodasLasSolicitudes();
        return ResponseEntity.ok(solicitudes);
    }

    /**
     * Obtener solo solicitudes pendientes (para administradores)
     */
    @GetMapping("/admin/pendientes")
    public ResponseEntity<List<SolicitudCambioPerfilDTO>> obtenerSolicitudesPendientes() {
        List<SolicitudCambioPerfilDTO> solicitudes = solicitudService.obtenerSolicitudesPendientes();
        return ResponseEntity.ok(solicitudes);
    }

    /**
     * Aprobar una solicitud (solo administradores)
     */
    @PutMapping("/{solicitudId}/aprobar")
    public ResponseEntity<SolicitudCambioPerfilDTO> aprobarSolicitud(
            @PathVariable Long solicitudId,
            @RequestBody Map<String, String> request) {
        
        String adminProcesador = request.get("adminProcesador");
        String comentariosAdmin = request.get("comentariosAdmin");
        
        SolicitudCambioPerfilDTO solicitud = solicitudService.aprobarSolicitud(solicitudId, adminProcesador, comentariosAdmin);
        return ResponseEntity.ok(solicitud);
    }

    /**
     * Rechazar una solicitud (solo administradores)
     */
    @PutMapping("/{solicitudId}/rechazar")
    public ResponseEntity<SolicitudCambioPerfilDTO> rechazarSolicitud(
            @PathVariable Long solicitudId,
            @RequestBody Map<String, String> request) {
        
        String adminProcesador = request.get("adminProcesador");
        String motivoRechazo = request.get("motivoRechazo");
        String comentariosAdmin = request.get("comentariosAdmin");
        
        SolicitudCambioPerfilDTO solicitud = solicitudService.rechazarSolicitud(solicitudId, adminProcesador, motivoRechazo, comentariosAdmin);
        return ResponseEntity.ok(solicitud);
    }

    /**
     * Endpoint para obtener estadísticas de solicitudes (para administradores)
     */
    @GetMapping("/admin/estadisticas")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas() {
        List<SolicitudCambioPerfilDTO> todas = solicitudService.obtenerTodasLasSolicitudes();
        List<SolicitudCambioPerfilDTO> pendientes = solicitudService.obtenerSolicitudesPendientes();
        
        long aprobadas = todas.stream()
                .filter(s -> "APROBADA".equals(s.getEstado()))
                .count();
        
        long rechazadas = todas.stream()
                .filter(s -> "RECHAZADA".equals(s.getEstado()))
                .count();
        
        Map<String, Object> estadisticas = Map.of(
            "total", todas.size(),
            "pendientes", pendientes.size(),
            "aprobadas", aprobadas,
            "rechazadas", rechazadas
        );
        
        return ResponseEntity.ok(estadisticas);
    }
}
