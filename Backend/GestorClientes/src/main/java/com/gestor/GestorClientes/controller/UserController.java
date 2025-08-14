package com.gestor.GestorClientes.controller;

import com.gestor.GestorClientes.controller.dto.AuthResponse;
import com.gestor.GestorClientes.controller.dto.LoginRequestDTO;
import com.gestor.GestorClientes.controller.dto.SendCredentialsRequest;
import com.gestor.GestorClientes.controller.dto.SendCredentialsResponse;
import com.gestor.GestorClientes.service.AuthenticationService;
import com.gestor.GestorClientes.service.CredentialService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private AuthenticationService authService;

    private final CredentialService credentialService;

    public UserController(CredentialService credentialService) {
        this.credentialService = credentialService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequestDTO request) {
        AuthResponse response = authService.loginUser(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/send-credentials")
    public ResponseEntity<?> sendCredentials(@RequestBody SendCredentialsRequest req) {
        try {
            var items = credentialService.processEmail(req.email());
            return ResponseEntity.ok(
                    new SendCredentialsResponse(req.email(), items.size(), items)
            );
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Email no encontrado"));
        }
    }
}
