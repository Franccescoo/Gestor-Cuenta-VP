package com.gestor.GestorClientes.service;

import com.gestor.GestorClientes.controller.dto.UserPerfilDTO;
import com.gestor.GestorClientes.persistence.entity.CategoriaEntity;
import com.gestor.GestorClientes.persistence.entity.SistemaEntity;
import com.gestor.GestorClientes.persistence.entity.UserEntity;
import com.gestor.GestorClientes.persistence.repositories.CategoriaRepository;
import com.gestor.GestorClientes.persistence.repositories.SistemaRepository;
import com.gestor.GestorClientes.persistence.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Consumer;
import java.util.function.Function;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private SistemaRepository sistemaRepository;
    @Autowired private CategoriaRepository categoriaRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    // -------------------- Password --------------------
    @Transactional
    public void cambiarPassword(String playerId, Integer sistemaId, String newPassword) {
        if (newPassword == null || newPassword.trim().length() < 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Contraseña inválida (mínimo 8 caracteres).");
        }
        UserEntity user = userRepository.findEntityByPlayerIdAndRolId(playerId, sistemaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La nueva contraseña no puede ser igual a la anterior.");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // -------------------- Update parciales -> DTO --------------------
    @Transactional
    public UserPerfilDTO actualizarDatosParciales(String playerId, Integer rolId, Map<String, Object> body) {
        UserEntity user = userRepository.findEntityByPlayerIdAndRolId(playerId, rolId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        // Campos de texto directo
        setIfPresent(body, "nombreCompleto", Object::toString, user::setNombreCompleto);
        setIfPresent(body, "apellidoCompleto", Object::toString, user::setApellidoCompleto);
        setIfPresent(body, "email", Object::toString, user::setEmail);
        setIfPresent(body, "celular", Object::toString, user::setCelular);
        setIfPresent(body, "login", Object::toString, user::setLogin);
        setIfPresent(body, "numeroDocumento", Object::toString, user::setNumeroDocumento);
        setIfPresent(body, "tipoDocumento", Object::toString, user::setTipoDocumento);
        setIfPresent(body, "usuarios", Object::toString, user::setUsername);

        setIfPresent(body, "calle", Object::toString, user::setCalle);
        setIfPresent(body, "numero", Object::toString, user::setNumero);
        setIfPresent(body, "comuna", Object::toString, user::setComuna);
        setIfPresent(body, "region", Object::toString, user::setRegion);
        setIfPresent(body, "pais", Object::toString, user::setPais);
        setIfPresent(body, "notaEntrega", Object::toString, user::setNotaEntrega);

        // Conversiones
        setIfPresent(body, "verificado", UserService::toBoolean, user::setVerificado);
        setIfPresent(body, "activo",     UserService::toBoolean, user::setActivo);
        setIfPresent(body, "puntosTotal",UserService::toInteger, user::setPuntosTotal);
        setIfPresent(body, "fechaCumpleanos", UserService::toLocalDate, user::setFechaCumpleanos);
        setIfPresent(body, "fechaUltimaActualizacion", UserService::toLocalDate, user::setFechaUltimaActualizacion);
        setIfPresent(body, "categoriaId", UserService::toInteger, user::setCategoriaId);

        if (user.getFechaUltimaActualizacion() == null) {
            user.setFechaUltimaActualizacion(LocalDate.now());
        }

        user = userRepository.save(user);
        return toPerfilDTO(user);
    }

    // -------------------- Perfil --------------------
    @Transactional(readOnly = true)
    public Map<String, Object> obtenerPerfil(String playerId, Integer sistemaId) {
        var u = userRepository.findEntityByPlayerIdAndRolId(playerId, sistemaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "No existe usuario para playerId=" + playerId + " en sistemaId=" + sistemaId));

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("player_id", u.getPlayerId());
        out.put("sistema_id", u.getRolId());
        out.put("puntos_total", u.getPuntosTotal());
        out.put("fecha_ultima_actualizacion",
                u.getFechaUltimaActualizacion() != null ? u.getFechaUltimaActualizacion().toString() : null);
        out.put("nombre_completo", u.getNombreCompleto());
        out.put("apellido_completo", u.getApellidoCompleto());
        out.put("fecha_cumpleanos",
                u.getFechaCumpleanos() != null ? u.getFechaCumpleanos().toString() : null);
        out.put("email", u.getEmail());
        out.put("celular", u.getCelular());
        out.put("login", u.getLogin());
        out.put("tipo_documento", u.getTipoDocumento());
        out.put("numero_documento", u.getNumeroDocumento());
        out.put("verificado", u.getVerificado());
        out.put("activo", u.getActivo());
        out.put("categoria_id", u.getCategoriaId());
        out.put("usuarios", u.getUsername());
        out.put("calle", u.getCalle());
        out.put("numero", u.getNumero());
        out.put("comuna", u.getComuna());
        out.put("region", u.getRegion());
        out.put("pais", u.getPais());
        out.put("nota_entrega", u.getNotaEntrega());

        String sistemaNombre = sistemaRepository.findById(sistemaId)
                .map(SistemaEntity::getNombre)
                .orElse("Sistema " + sistemaId);
        out.put("sistema_nombre", sistemaNombre);
        return out;
    }

    // -------------------- Helpers --------------------
    private static <T> void setIfPresent(Map<String, Object> body, String key,
                                         Function<Object,T> converter, Consumer<T> setter) {
        if (body.containsKey(key)) {
            Object raw = body.get(key);
            setter.accept(raw == null ? null : converter.apply(raw));
        }
    }

    private static Integer toInteger(Object v) {
        if (v == null) return null;
        if (v instanceof Number n) return n.intValue();
        String s = v.toString().trim();
        return s.isEmpty() ? null : Integer.valueOf(s);
    }

    private static Boolean toBoolean(Object v) {
        if (v == null) return null;
        if (v instanceof Boolean b) return b;
        String s = v.toString().trim();
        return s.isEmpty() ? null : (s.equalsIgnoreCase("true") || s.equals("1"));
    }

    private static LocalDate toLocalDate(Object v) {
        if (v == null) return null;
        if (v instanceof LocalDate d) return d;
        String s = v.toString().trim();
        return s.isEmpty() ? null : LocalDate.parse(s);
    }

    private UserPerfilDTO toPerfilDTO(UserEntity u) {
        UserPerfilDTO dto = new UserPerfilDTO();
        dto.setPlayerId(u.getPlayerId());
        dto.setSistemaId(u.getRolId());
        dto.setPuntosTotal(u.getPuntosTotal());
        dto.setFechaUltimaActualizacion(u.getFechaUltimaActualizacion());
        dto.setNombreCompleto(u.getNombreCompleto());
        dto.setApellidoCompleto(u.getApellidoCompleto());
        dto.setFechaCumpleanos(u.getFechaCumpleanos());
        dto.setEmail(u.getEmail());
        dto.setCelular(u.getCelular());
        dto.setLogin(u.getLogin());
        dto.setTipoDocumento(u.getTipoDocumento());
        dto.setNumeroDocumento(u.getNumeroDocumento());
        dto.setVerificado(u.getVerificado());
        dto.setActivo(u.getActivo());
        dto.setCategoriaId(u.getCategoriaId());
        if (u.getCategoriaId() != null) {
            Optional<CategoriaEntity> cat = categoriaRepository.findById(u.getCategoriaId());
            dto.setCategoriaNombre(cat.map(CategoriaEntity::getNombre).orElse(null));
        }
        dto.setUsuarios(u.getUsername());
        dto.setCalle(u.getCalle());
        dto.setNumero(u.getNumero());
        dto.setComuna(u.getComuna());
        dto.setRegion(u.getRegion());
        dto.setPais(u.getPais());
        dto.setNotaEntrega(u.getNotaEntrega());
        if (u.getRolId() != null) {
            String sistemaNombre = sistemaRepository.findById(u.getRolId())
                    .map(SistemaEntity::getNombre)
                    .orElse(null);
            dto.setSistemaNombre(sistemaNombre);
        }
        return dto;
    }
}
