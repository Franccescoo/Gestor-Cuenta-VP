package com.gestor.GestorClientes.controller;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.gestor.GestorClientes.controller.dto.CompletarRegistroRequest;
import com.gestor.GestorClientes.persistence.entity.UserEntity;
import com.gestor.GestorClientes.persistence.repositories.UserRepository;
import com.gestor.GestorClientes.service.UserService;
import com.gestor.GestorClientes.util.JwtUtil;
import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @PutMapping("/actualizar")
    public ResponseEntity<?> actualizarUsuario(
            @RequestParam String playerId,
            @RequestParam Integer sistemaId,
            @RequestBody Map<String, Object> body
    ) {
        UserEntity actualizado = userService.actualizarDatosParciales(playerId, sistemaId, body);
        return ResponseEntity.ok(actualizado);
    }

    // Helper para null o vacío
    private boolean isNullOrEmpty(String s) {
        return s == null || s.trim().isEmpty();
    }


    @GetMapping("/perfil")
    public ResponseEntity<Map<String,Object>> getPerfil(@RequestParam String playerId,
                                                        @RequestParam Integer sistemaId) {
        return ResponseEntity.ok(userService.obtenerPerfil(playerId, sistemaId));
    }



    @GetMapping("/me/token-data")
    public ResponseEntity<?> obtenerDatosDelToken(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            // Quita el "Bearer " si viene
            String token = authorizationHeader.replace("Bearer ", "");

            // Valida y decodifica el token
            DecodedJWT decodedJWT = jwtUtil.validateToken(token);

            // Extrae claims
            String playerId = decodedJWT.getClaim("playerId").asString();
            Integer sistemaId = decodedJWT.getClaim("sistemaId").asInt();
            String sistemaNombre = decodedJWT.getClaim("sistemaNombre").asString();
            String username = decodedJWT.getSubject();
            String authorities = decodedJWT.getClaim("authorities").asString();

            return ResponseEntity.ok(Map.of(
                    "playerId", playerId,
                    "sistemaId", sistemaId,
                    "sistemaNombre", sistemaNombre,
                    "username", username,
                    "authorities", authorities
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Token inválido");
        }
    }



    @GetMapping(value = "/me/player-id", produces = "application/json")
    public ResponseEntity<Map<String, Object>> obtenerPlayerIdYSistema(
            @RequestHeader(name = "Authorization", required = false) String authorizationHeader) {

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error", "Falta Authorization Bearer"));
        }

        try {
            // Quita "Bearer "
            String token = authorizationHeader.substring(7);

            // Valida y decodifica el JWT
            DecodedJWT decodedJWT = jwtUtil.validateToken(token);

            // Extrae claims
            String playerId = decodedJWT.getClaim("playerId").asString();

            Integer sistemaId = null;
            var sistemaClaim = decodedJWT.getClaim("sistemaId");
            if (!sistemaClaim.isNull()) {
                try {
                    sistemaId = sistemaClaim.asInt(); // caso típico
                } catch (Exception ex) {
                    // fallback si vino como string
                    String s = sistemaClaim.asString();
                    if (s != null && !s.isBlank()) {
                        sistemaId = Integer.valueOf(s);
                    }
                }
            }

            return ResponseEntity.ok(Map.of(
                    "playerId",  playerId,
                    "sistemaId", sistemaId   // puede ser null si no está en el token
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Token inválido o expirado"));
        }
    }


    @PostMapping("/validar-doc")
    public ResponseEntity<Map<String, Object>> validarDoc(@RequestParam("file") MultipartFile file) {
        Map<String, Object> resultado = new HashMap<>();
        try {
            File tempFile = File.createTempFile("documento", ".jpg");
            file.transferTo(tempFile);

            // Procesar OCR
            ITesseract tesseract = new Tesseract();
            tesseract.setLanguage("spa"); // o "eng" para inglés, puedes combinar "spa+eng"
            String text = tesseract.doOCR(tempFile);

            // (Opcional) Limpia el texto y extrae datos clave usando Regex
            resultado.put("ocrText", text);
            // Aquí puedes hacer parseo de nombre, apellido, rut, fecha, etc

            tempFile.delete();
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }



}
