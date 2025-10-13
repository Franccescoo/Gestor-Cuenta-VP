package com.gestor.GestorClientes.controller;

import com.gestor.GestorClientes.controller.dto.AuthResponse;
import com.gestor.GestorClientes.controller.dto.LoginRequestDTO;
import com.gestor.GestorClientes.controller.dto.SendCredentialsRequest;
import com.gestor.GestorClientes.controller.dto.SendCredentialsResponse;
import com.gestor.GestorClientes.service.AuthenticationService;
import com.gestor.GestorClientes.service.CredentialService;
import com.gestor.GestorClientes.service.EmailJSVerificationService;
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
    private final EmailJSVerificationService emailJSVerificationService;

    public UserController(CredentialService credentialService, EmailJSVerificationService emailJSVerificationService) {
        this.credentialService = credentialService;
        this.emailJSVerificationService = emailJSVerificationService;
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
            
            // Validar email
            if (!emailJSVerificationService.isValidEmail(req.email())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Formato de email inválido"));
            }

            // Solo devolver los datos, el frontend se encargará del envío del email
            return ResponseEntity.ok(
                    new SendCredentialsResponse(req.email(), items.size(), items)
            );
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Email no encontrado"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error interno del servidor"));
        }
    }
}
