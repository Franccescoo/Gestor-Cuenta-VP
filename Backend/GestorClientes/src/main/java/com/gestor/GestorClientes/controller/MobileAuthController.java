package com.gestor.GestorClientes.controller;

import com.gestor.GestorClientes.controller.dto.LoginRequestDTO;
import com.gestor.GestorClientes.controller.dto.AuthResponse;
import com.gestor.GestorClientes.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mobile/auth")
@CrossOrigin(origins = "*")
public class MobileAuthController {

    @Autowired
    private AuthenticationService authenticationService;

    /**
     * Login para usuarios móviles
     * Endpoint simplificado para autenticación desde dispositivos móviles
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginMobile(@RequestBody LoginRequestDTO loginRequest) {
        try {
            AuthResponse response = authenticationService.loginUser(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error de autenticación: " + e.getMessage());
        }
    }

    /**
     * Verificar token móvil
     * Endpoint para validar si el token del usuario es válido
     */
    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken() {
        // El token se valida automáticamente por el filtro JWT
        return ResponseEntity.ok("Token válido");
    }
}
