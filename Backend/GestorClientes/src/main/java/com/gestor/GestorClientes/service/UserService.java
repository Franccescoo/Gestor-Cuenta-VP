package com.gestor.GestorClientes.service;

import com.gestor.GestorClientes.persistence.entity.UserEntity;
import com.gestor.GestorClientes.persistence.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

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

        // Guarda solo con los datos nuevos
        return userRepository.save(user);
    }


}
