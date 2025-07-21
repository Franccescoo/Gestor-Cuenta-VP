package com.gestor.GestorClientes.controller;

import com.gestor.GestorClientes.controller.dto.CompletarRegistroRequest;
import com.gestor.GestorClientes.persistence.entity.UserEntity;
import com.gestor.GestorClientes.persistence.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/completar-registro")
    public ResponseEntity<?> completarRegistro(@RequestBody CompletarRegistroRequest req) {
        // Busca al usuario
        Optional<UserEntity> userOpt = userRepository.findById(req.playerId);
        if (!userOpt.isPresent()) return ResponseEntity.notFound().build();

        UserEntity user = userOpt.get();
        user.setNombreCompleto(req.nombreCompleto);
        user.setApellidoCompleto(req.apellidoCompleto);
        user.setFechaCumpleanos(LocalDate.parse(req.fechaCumpleanos));
        user.setEmail(req.email);
        user.setCelular(req.celular);
        user.setNumeroDocumento(req.numeroDocumento);
        if (req.usuarios != null && !req.usuarios.isEmpty()) user.setUsername(req.usuarios);
        if (req.password != null && !req.password.isEmpty()) user.setPassword(passwordEncoder.encode(req.password));

        // Suma los 10 puntos si aún no los tenía
        if (user.getPuntosTotal() == null) user.setPuntosTotal(10);
        else user.setPuntosTotal(user.getPuntosTotal() + 10);

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}
