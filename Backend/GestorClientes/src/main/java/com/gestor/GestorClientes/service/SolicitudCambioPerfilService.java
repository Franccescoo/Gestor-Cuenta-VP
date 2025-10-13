package com.gestor.GestorClientes.service;

import com.gestor.GestorClientes.controller.dto.CrearSolicitudRequest;
import com.gestor.GestorClientes.controller.dto.SolicitudCambioPerfilDTO;
import com.gestor.GestorClientes.persistence.entity.SolicitudCambioPerfil;
import com.gestor.GestorClientes.persistence.entity.UserEntity;
import com.gestor.GestorClientes.persistence.repositories.SolicitudCambioPerfilRepository;
import com.gestor.GestorClientes.persistence.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class SolicitudCambioPerfilService {

    @Autowired
    private SolicitudCambioPerfilRepository solicitudRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    /**
     * Crear una nueva solicitud de cambio de perfil
     */
    @Transactional
    public SolicitudCambioPerfilDTO crearSolicitud(CrearSolicitudRequest request) {
        // Verificar que el usuario existe
        UserEntity usuario = userRepository.findEntityByPlayerIdAndRolId(request.playerId(), request.sistemaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        // Verificar que no hay una solicitud pendiente para el mismo usuario
        if (solicitudRepository.existsSolicitudPendiente(request.playerId(), request.sistemaId(), "PERFIL")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "Ya existe una solicitud pendiente para este usuario. Espere a que sea procesada.");
        }

        // Crear la solicitud
        SolicitudCambioPerfil solicitud = new SolicitudCambioPerfil(
            request.playerId(),
            request.sistemaId(),
            request.tipoSolicitud(),
            request.camposCambiar(),
            request.valoresActuales(),
            request.valoresNuevos()
        );

        solicitud.setComentariosUsuario(request.comentariosUsuario());

        solicitud = solicitudRepository.save(solicitud);

        return new SolicitudCambioPerfilDTO(solicitud);
    }

    /**
     * Obtener solicitudes de un usuario específico
     */
    @Transactional(readOnly = true)
    public List<SolicitudCambioPerfilDTO> obtenerSolicitudesUsuario(String playerId, Integer sistemaId) {
        List<SolicitudCambioPerfil> solicitudes = solicitudRepository
                .findByPlayerIdAndSistemaIdOrderByFechaCreacionDesc(playerId, sistemaId);

        return solicitudes.stream()
                .map(SolicitudCambioPerfilDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Obtener todas las solicitudes para administradores
     */
    @Transactional(readOnly = true)
    public List<SolicitudCambioPerfilDTO> obtenerTodasLasSolicitudes() {
        List<SolicitudCambioPerfil> solicitudes = solicitudRepository.findAllOrderByFechaCreacionDesc();

        return solicitudes.stream()
                .map(solicitud -> {
                    SolicitudCambioPerfilDTO dto = new SolicitudCambioPerfilDTO(solicitud);
                    // Agregar información del usuario
                    UserEntity usuario = userRepository.findEntityByPlayerIdAndRolId(
                            solicitud.getPlayerId(), solicitud.getSistemaId()).orElse(null);
                    if (usuario != null) {
                        dto.setNombreUsuario(usuario.getNombreCompleto() + " " + usuario.getApellidoCompleto());
                        dto.setEmailUsuario(usuario.getEmail());
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * Obtener solicitudes pendientes
     */
    @Transactional(readOnly = true)
    public List<SolicitudCambioPerfilDTO> obtenerSolicitudesPendientes() {
        List<SolicitudCambioPerfil> solicitudes = solicitudRepository
                .findByEstadoOrderByFechaCreacionDesc(SolicitudCambioPerfil.EstadoSolicitud.PENDIENTE);

        return solicitudes.stream()
                .map(solicitud -> {
                    SolicitudCambioPerfilDTO dto = new SolicitudCambioPerfilDTO(solicitud);
                    // Agregar información del usuario
                    UserEntity usuario = userRepository.findEntityByPlayerIdAndRolId(
                            solicitud.getPlayerId(), solicitud.getSistemaId()).orElse(null);
                    if (usuario != null) {
                        dto.setNombreUsuario(usuario.getNombreCompleto() + " " + usuario.getApellidoCompleto());
                        dto.setEmailUsuario(usuario.getEmail());
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * Aprobar una solicitud
     */
    @Transactional
    public SolicitudCambioPerfilDTO aprobarSolicitud(Long solicitudId, String adminProcesador, String comentariosAdmin) {
        SolicitudCambioPerfil solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitud no encontrada"));

        if (solicitud.getEstado() != SolicitudCambioPerfil.EstadoSolicitud.PENDIENTE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La solicitud no está pendiente");
        }

        // Aplicar el cambio al usuario
        aplicarCambioAlUsuario(solicitud);

        // Actualizar la solicitud
        solicitud.setEstado(SolicitudCambioPerfil.EstadoSolicitud.APROBADA);
        solicitud.setAdminProcesador(adminProcesador);
        solicitud.setComentariosAdmin(comentariosAdmin);
        solicitud.setFechaProcesamiento(LocalDateTime.now());

        solicitud = solicitudRepository.save(solicitud);

        return new SolicitudCambioPerfilDTO(solicitud);
    }

    /**
     * Rechazar una solicitud
     */
    @Transactional
    public SolicitudCambioPerfilDTO rechazarSolicitud(Long solicitudId, String adminProcesador, 
                                                     String motivoRechazo, String comentariosAdmin) {
        SolicitudCambioPerfil solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitud no encontrada"));

        if (solicitud.getEstado() != SolicitudCambioPerfil.EstadoSolicitud.PENDIENTE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La solicitud no está pendiente");
        }

        // Actualizar la solicitud
        solicitud.setEstado(SolicitudCambioPerfil.EstadoSolicitud.RECHAZADA);
        solicitud.setAdminProcesador(adminProcesador);
        solicitud.setMotivoRechazo(motivoRechazo);
        solicitud.setComentariosAdmin(comentariosAdmin);
        solicitud.setFechaProcesamiento(LocalDateTime.now());

        solicitud = solicitudRepository.save(solicitud);

        return new SolicitudCambioPerfilDTO(solicitud);
    }

    /**
     * Aplicar el cambio al usuario
     */
    private void aplicarCambioAlUsuario(SolicitudCambioPerfil solicitud) {
        System.out.println("🔄 Iniciando aplicación de cambios para solicitud: " + solicitud.getId());
        System.out.println("📋 Player ID: " + solicitud.getPlayerId() + ", Sistema ID: " + solicitud.getSistemaId());
        
        UserEntity usuario = userRepository.findEntityByPlayerIdAndRolId(
                solicitud.getPlayerId(), solicitud.getSistemaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        System.out.println("👤 Usuario encontrado: " + usuario.getNombreCompleto() + " " + usuario.getApellidoCompleto());

        try {
            // Parsear los campos y valores nuevos
            String camposJson = solicitud.getCamposCambiar();
            String valoresJson = solicitud.getValoresNuevos();
            
            System.out.println("📝 Campos a cambiar: " + camposJson);
            System.out.println("🆕 Valores nuevos: " + valoresJson);
            
            // Parsear JSON de campos
            List<String> campos = Arrays.asList(camposJson.replace("[", "").replace("]", "").replace("\"", "").split(","));
            Map<String, String> valores = new HashMap<>();
            
            // Parsear JSON de valores (formato simple)
            String valoresClean = valoresJson.replace("{", "").replace("}", "");
            if (!valoresClean.trim().isEmpty()) {
                String[] pares = valoresClean.split(",");
                for (String par : pares) {
                    String[] keyValue = par.split(":");
                    if (keyValue.length == 2) {
                        String key = keyValue[0].trim().replace("\"", "");
                        String value = keyValue[1].trim().replace("\"", "");
                        valores.put(key, value);
                    }
                }
            }
            
            // Aplicar cambios según el campo
            boolean cambiosAplicados = false;
            for (String campo : campos) {
                campo = campo.trim();
                String valorNuevo = valores.get(campo);
                
                if (valorNuevo != null && !valorNuevo.isEmpty()) {
                    switch (campo) {
                        case "nombreCompleto":
                            System.out.println("✏️ Cambiando nombre: '" + usuario.getNombreCompleto() + "' → '" + valorNuevo + "'");
                            usuario.setNombreCompleto(valorNuevo);
                            cambiosAplicados = true;
                            break;
                        case "apellidoCompleto":
                            System.out.println("✏️ Cambiando apellido: '" + usuario.getApellidoCompleto() + "' → '" + valorNuevo + "'");
                            usuario.setApellidoCompleto(valorNuevo);
                            cambiosAplicados = true;
                            break;
                        case "fechaNacimiento":
                            try {
                                usuario.setFechaCumpleanos(LocalDate.parse(valorNuevo));
                                cambiosAplicados = true;
                            } catch (Exception e) {
                                System.err.println("Error parsing fecha: " + e.getMessage());
                            }
                            break;
                        case "celular":
                            System.out.println("✏️ Cambiando celular: '" + usuario.getCelular() + "' → '" + valorNuevo + "'");
                            usuario.setCelular(valorNuevo);
                            cambiosAplicados = true;
                            break;
                        case "numeroDocumento":
                            usuario.setNumeroDocumento(valorNuevo);
                            cambiosAplicados = true;
                            break;
                        case "calle":
                            usuario.setCalle(valorNuevo);
                            cambiosAplicados = true;
                            break;
                        case "numero":
                            usuario.setNumero(valorNuevo);
                            cambiosAplicados = true;
                            break;
                        case "comuna":
                            usuario.setComuna(valorNuevo);
                            cambiosAplicados = true;
                            break;
                        case "region":
                            usuario.setRegion(valorNuevo);
                            cambiosAplicados = true;
                            break;
                        case "pais":
                            usuario.setPais(valorNuevo);
                            cambiosAplicados = true;
                            break;
                        case "notaEntrega":
                            usuario.setNotaEntrega(valorNuevo);
                            cambiosAplicados = true;
                            break;
                        default:
                            System.err.println("Campo no reconocido: " + campo);
                    }
                }
            }
            
            // Solo actualizar si hubo cambios
            if (cambiosAplicados) {
                usuario.setFechaUltimaActualizacion(LocalDateTime.now().toLocalDate());
                userRepository.save(usuario);
                System.out.println("✅ Cambios aplicados y guardados en BD para usuario: " + solicitud.getPlayerId() + " sistema: " + solicitud.getSistemaId());
                System.out.println("📅 Fecha de actualización: " + LocalDateTime.now().toLocalDate());
            } else {
                System.err.println("⚠️ No se aplicaron cambios para la solicitud: " + solicitud.getId());
            }
            
        } catch (Exception e) {
            System.err.println("❌ Error aplicando cambios al usuario: " + e.getMessage());
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                "Error aplicando cambios al usuario: " + e.getMessage());
        }

        // Marcar la solicitud como procesada
        solicitud.setEstado(SolicitudCambioPerfil.EstadoSolicitud.PROCESADA);
        solicitudRepository.save(solicitud);
    }

    /**
     * Obtener una solicitud específica
     */
    @Transactional(readOnly = true)
    public SolicitudCambioPerfilDTO obtenerSolicitud(Long solicitudId, String playerId, Integer sistemaId) {
        SolicitudCambioPerfil solicitud = solicitudRepository
                .findByIdAndPlayerIdAndSistemaId(solicitudId, playerId, sistemaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitud no encontrada"));

        return new SolicitudCambioPerfilDTO(solicitud);
    }

    /**
     * Obtener solicitudes por estado (para administradores)
     */
    @Transactional(readOnly = true)
    public List<SolicitudCambioPerfilDTO> obtenerSolicitudesPorEstado(SolicitudCambioPerfil.EstadoSolicitud estado) {
        List<SolicitudCambioPerfil> solicitudes = solicitudRepository
                .findByEstadoOrderByFechaCreacionDesc(estado);

        return solicitudes.stream()
                .map(solicitud -> {
                    SolicitudCambioPerfilDTO dto = new SolicitudCambioPerfilDTO(solicitud);
                    // Agregar información del usuario
                    UserEntity usuario = userRepository.findEntityByPlayerIdAndRolId(
                            solicitud.getPlayerId(), solicitud.getSistemaId()).orElse(null);
                    if (usuario != null) {
                        dto.setNombreUsuario(usuario.getNombreCompleto() + " " + usuario.getApellidoCompleto());
                        dto.setEmailUsuario(usuario.getEmail());
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * Aprobar una solicitud (método simplificado para admin)
     */
    @Transactional
    public boolean aprobarSolicitud(Long solicitudId, String comentariosAdmin) {
        try {
            SolicitudCambioPerfil solicitud = solicitudRepository.findById(solicitudId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitud no encontrada"));

            if (solicitud.getEstado() != SolicitudCambioPerfil.EstadoSolicitud.PENDIENTE) {
                return false;
            }

            // Aplicar el cambio al usuario
            aplicarCambioAlUsuario(solicitud);

            // Actualizar la solicitud
            solicitud.setEstado(SolicitudCambioPerfil.EstadoSolicitud.APROBADA);
            solicitud.setAdminProcesador("admin"); // Por ahora hardcodeado
            solicitud.setComentariosAdmin(comentariosAdmin);
            solicitud.setFechaProcesamiento(LocalDateTime.now());

            solicitudRepository.save(solicitud);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Rechazar una solicitud (método simplificado para admin)
     */
    @Transactional
    public boolean rechazarSolicitud(Long solicitudId, String comentariosAdmin) {
        try {
            SolicitudCambioPerfil solicitud = solicitudRepository.findById(solicitudId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitud no encontrada"));

            if (solicitud.getEstado() != SolicitudCambioPerfil.EstadoSolicitud.PENDIENTE) {
                return false;
            }

            // Actualizar la solicitud
            solicitud.setEstado(SolicitudCambioPerfil.EstadoSolicitud.RECHAZADA);
            solicitud.setAdminProcesador("admin"); // Por ahora hardcodeado
            solicitud.setComentariosAdmin(comentariosAdmin);
            solicitud.setFechaProcesamiento(LocalDateTime.now());

            solicitudRepository.save(solicitud);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Obtener una solicitud por ID (para administradores)
     */
    @Transactional(readOnly = true)
    public SolicitudCambioPerfilDTO obtenerSolicitudPorId(Long id) {
        SolicitudCambioPerfil solicitud = solicitudRepository.findById(id).orElse(null);
        if (solicitud == null) {
            return null;
        }

        SolicitudCambioPerfilDTO dto = new SolicitudCambioPerfilDTO(solicitud);
        // Agregar información del usuario
        UserEntity usuario = userRepository.findEntityByPlayerIdAndRolId(
                solicitud.getPlayerId(), solicitud.getSistemaId()).orElse(null);
        if (usuario != null) {
            dto.setNombreUsuario(usuario.getNombreCompleto() + " " + usuario.getApellidoCompleto());
            dto.setEmailUsuario(usuario.getEmail());
        }
        return dto;
    }

    /**
     * Obtener estadísticas de solicitudes
     */
    @Transactional(readOnly = true)
    public Map<String, Object> obtenerEstadisticasSolicitudes() {
        Map<String, Object> estadisticas = new HashMap<>();
        
        long totalSolicitudes = solicitudRepository.count();
        long pendientes = solicitudRepository.countByEstado(SolicitudCambioPerfil.EstadoSolicitud.PENDIENTE);
        long aprobadas = solicitudRepository.countByEstado(SolicitudCambioPerfil.EstadoSolicitud.APROBADA);
        long rechazadas = solicitudRepository.countByEstado(SolicitudCambioPerfil.EstadoSolicitud.RECHAZADA);
        
        estadisticas.put("totalSolicitudes", totalSolicitudes);
        estadisticas.put("pendientes", pendientes);
        estadisticas.put("aprobadas", aprobadas);
        estadisticas.put("rechazadas", rechazadas);
        
        return estadisticas;
    }

    /**
     * Método de debug para verificar el estado de un usuario
     */
    public ResponseEntity<Map<String, Object>> debugUsuario(String playerId, Integer sistemaId) {
        Map<String, Object> debugInfo = new HashMap<>();
        
        try {
            UserEntity usuario = userRepository.findEntityByPlayerIdAndRolId(playerId, sistemaId).orElse(null);
            
            if (usuario != null) {
                debugInfo.put("usuarioEncontrado", true);
                debugInfo.put("playerId", usuario.getPlayerId());
                debugInfo.put("sistemaId", sistemaId);
                debugInfo.put("nombreCompleto", usuario.getNombreCompleto());
                debugInfo.put("apellidoCompleto", usuario.getApellidoCompleto());
                debugInfo.put("celular", usuario.getCelular());
                debugInfo.put("fechaUltimaActualizacion", usuario.getFechaUltimaActualizacion());
                debugInfo.put("email", usuario.getEmail());
                debugInfo.put("numeroDocumento", usuario.getNumeroDocumento());
                
                // Información de direcciones
                debugInfo.put("calle", usuario.getCalle());
                debugInfo.put("numero", usuario.getNumero());
                debugInfo.put("comuna", usuario.getComuna());
                debugInfo.put("region", usuario.getRegion());
                debugInfo.put("pais", usuario.getPais());
                debugInfo.put("notaEntrega", usuario.getNotaEntrega());
                
                return ResponseEntity.ok(debugInfo);
            } else {
                debugInfo.put("usuarioEncontrado", false);
                debugInfo.put("playerId", playerId);
                debugInfo.put("sistemaId", sistemaId);
                debugInfo.put("mensaje", "Usuario no encontrado en la base de datos");
                return ResponseEntity.ok(debugInfo);
            }
            
        } catch (Exception e) {
            debugInfo.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(debugInfo);
        }
    }

}
