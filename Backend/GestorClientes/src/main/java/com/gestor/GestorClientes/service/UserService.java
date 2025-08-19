package com.gestor.GestorClientes.service;

import com.gestor.GestorClientes.persistence.entity.SistemaEntity;
import com.gestor.GestorClientes.persistence.entity.UserEntity;
import com.gestor.GestorClientes.persistence.repositories.SistemaRepository;
import com.gestor.GestorClientes.persistence.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.LinkedHashMap;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SistemaRepository sistemaRepository;

    public UserEntity actualizarDatosParciales(String playerId, Integer rolId, Map<String, Object> body) {
        UserEntity user = userRepository.findEntityByPlayerIdAndRolId(playerId, rolId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // NO actualices playerId ni rolId aquí

        if (body.containsKey("nombreCompleto")) user.setNombreCompleto((String) body.get("nombreCompleto"));
        if (body.containsKey("apellidoCompleto")) user.setApellidoCompleto((String) body.get("apellidoCompleto"));
        if (body.containsKey("fechaCumpleanos")) {
            String fecha = (String) body.get("fechaCumpleanos");
            user.setFechaCumpleanos(fecha != null ? LocalDate.parse(fecha) : null);
        }
        if (body.containsKey("email")) user.setEmail((String) body.get("email"));
        if (body.containsKey("celular")) user.setCelular((String) body.get("celular"));
        if (body.containsKey("numeroDocumento")) user.setNumeroDocumento((String) body.get("numeroDocumento"));
        if (body.containsKey("tipoDocumento")) user.setTipoDocumento((String) body.get("tipoDocumento"));
        if (body.containsKey("login")) user.setLogin((String) body.get("login"));
        if (body.containsKey("puntosTotal")) user.setPuntosTotal((Integer) body.get("puntosTotal"));
        if (body.containsKey("fechaUltimaActualizacion")) {
            String fecha = (String) body.get("fechaUltimaActualizacion");
            user.setFechaUltimaActualizacion(fecha != null ? LocalDate.parse(fecha) : null);
        }
        if (body.containsKey("verificado")) user.setVerificado((Boolean) body.get("verificado"));
        if (body.containsKey("activo")) user.setActivo((Boolean) body.get("activo"));
        if (body.containsKey("categoriaId")) user.setCategoriaId((Integer) body.get("categoriaId"));

        if (body.containsKey("calle"))       user.setCalle((String) body.get("calle"));
        if (body.containsKey("numero"))      user.setNumero((String) body.get("numero"));
        if (body.containsKey("comuna"))      user.setComuna((String) body.get("comuna"));
        if (body.containsKey("region"))      user.setRegion((String) body.get("region"));
        if (body.containsKey("pais"))        user.setPais((String) body.get("pais"));
        if (body.containsKey("notaEntrega")) user.setNotaEntrega((String) body.get("notaEntrega"));

        // Guarda solo con los datos nuevos
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> obtenerPerfil(String playerId, Integer sistemaId) {
        var u = userRepository.findEntityByPlayerIdAndRolId(playerId, sistemaId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe usuario para playerId=" + playerId + " en sistemaId=" + sistemaId
                ));

        Map<String, Object> out = new LinkedHashMap<>();
        // claves
        out.put("player_id", u.getPlayerId());
        out.put("sistema_id", u.getRolId()); // (= sistemaId)

        // principales
        out.put("puntos_total", u.getPuntosTotal());
        out.put("fecha_ultima_actualizacion",
                u.getFechaUltimaActualizacion() != null ? u.getFechaUltimaActualizacion().toString() : null);

        // identidad
        out.put("nombre_completo", u.getNombreCompleto());
        out.put("apellido_completo", u.getApellidoCompleto());
        out.put("fecha_cumpleanos",
                u.getFechaCumpleanos() != null ? u.getFechaCumpleanos().toString() : null);

        // contacto
        out.put("email", u.getEmail());
        out.put("celular", u.getCelular());
        out.put("login", u.getLogin());

        // documento
        out.put("tipo_documento", u.getTipoDocumento());
        out.put("numero_documento", u.getNumeroDocumento());

        // flags / otros
        out.put("verificado", u.getVerificado());
        out.put("activo", u.getActivo());
        out.put("categoria_id", u.getCategoriaId());
        out.put("usuarios", u.getUsername()); // columna 'usuarios'

        out.put("calle",  u.getCalle());
        out.put("numero", u.getNumero());
        out.put("comuna", u.getComuna());
        out.put("region", u.getRegion());
        out.put("pais",   u.getPais());
        out.put("nota_entrega", u.getNotaEntrega());

        String sistemaNombre = sistemaRepository.findById(sistemaId)
                .map(SistemaEntity::getNombre)
                .orElse("Sistema " + sistemaId);
        out.put("sistema_nombre", sistemaNombre);

        // ¡ojo! password nunca se expone
        return out;
    }


}
