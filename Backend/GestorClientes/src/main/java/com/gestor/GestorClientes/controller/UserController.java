package com.gestor.GestorClientes.controller;

import com.gestor.GestorClientes.controller.dto.AuthResponse;
import com.gestor.GestorClientes.controller.dto.LoginRequestDTO;
import com.gestor.GestorClientes.controller.dto.SendCredentialsRequest;
import com.gestor.GestorClientes.controller.dto.SendCredentialsResponse;
import com.gestor.GestorClientes.service.AuthenticationService;
import com.gestor.GestorClientes.service.CredentialService;
import com.gestor.GestorClientes.service.EmailJSVerificationService;
import com.gestor.GestorClientes.persistence.repositories.UserRepository;
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

    @Autowired
    private UserRepository userRepository;

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
            System.out.println("=== DEBUG: Iniciando sendCredentials ===");
            System.out.println("Email recibido: " + req.email());
            
            // Validar email primero
            System.out.println("=== DEBUG: Validando email ===");
            if (!emailJSVerificationService.isValidEmail(req.email())) {
                System.out.println("=== DEBUG: Email inválido ===");
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Formato de email inválido"));
            }
            System.out.println("=== DEBUG: Email válido ===");
            
            System.out.println("=== DEBUG: Procesando email con credentialService ===");
            var items = credentialService.processEmail(req.email());
            System.out.println("=== DEBUG: Items procesados: " + items.size() + " ===");

            // Solo devolver los datos, el frontend se encargará del envío del email
            return ResponseEntity.ok(
                    new SendCredentialsResponse(req.email(), items.size(), items)
            );
        } catch (NoSuchElementException e) {
            System.out.println("=== DEBUG: NoSuchElementException: " + e.getMessage() + " ===");
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Email no encontrado"));
        } catch (Exception e) {
            System.out.println("=== DEBUG: Exception: " + e.getMessage() + " ===");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error interno del servidor: " + e.getMessage()));
        }
    }

    @GetMapping("/health-db")
    public ResponseEntity<?> healthCheck() {
        try {
            System.out.println("=== HEALTH CHECK: Probando conexión a BD ===");
            long count = userRepository.count();
            System.out.println("=== HEALTH CHECK: Conexión exitosa! Total usuarios: " + count + " ===");
            return ResponseEntity.ok(Map.of(
                "status", "OK",
                "database", "CONNECTED",
                "total_users", count,
                "message", "Base de datos conectada correctamente"
            ));
        } catch (Exception e) {
            System.out.println("=== HEALTH CHECK ERROR: " + e.getMessage() + " ===");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "status", "ERROR",
                        "database", "DISCONNECTED",
                        "message", "Error de conexión a BD: " + e.getMessage()
                    ));
        }
    }
}
