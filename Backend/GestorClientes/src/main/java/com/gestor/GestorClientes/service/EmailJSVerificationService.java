package com.gestor.GestorClientes.service;

import com.gestor.GestorClientes.controller.dto.SystemCredentialDTO;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class EmailJSVerificationService {

    // ===================== CONFIG EMAILJS =====================
    private final String EMAILJS_SERVICE_ID = "service_tdy9frr";
    private final String EMAILJS_TEMPLATE_ID = "template_1uywn0d"; // Template prestige_welcome
    private final String EMAILJS_PUBLIC_KEY = "2YxIX3D0inCAbCBmQ";
    private final String EMAILJS_API_URL = "https://api.emailjs.com/api/v1.0/email/send";

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Envía email de verificación usando EmailJS
     * @param userEmail Email del usuario
     * @param generatedPassword Contraseña generada
     * @param loginUrl URL de acceso al sistema
     * @return true si se envió correctamente
     */
    public boolean sendVerificationEmail(String userEmail, String generatedPassword, String loginUrl) {
        try {
            // Preparar los datos para el template
            Map<String, Object> templateParams = Map.of(
                "user_email", userEmail,
                "generated_password", generatedPassword,
                "login_url", loginUrl
            );

            // Crear el payload para EmailJS
            Map<String, Object> payload = Map.of(
                "service_id", EMAILJS_SERVICE_ID,
                "template_id", EMAILJS_TEMPLATE_ID,
                "user_id", EMAILJS_PUBLIC_KEY,
                "template_params", templateParams
            );

            // Configurar headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            // Enviar request a EmailJS
            ResponseEntity<String> response = restTemplate.postForEntity(
                EMAILJS_API_URL, 
                entity, 
                String.class
            );

            return response.getStatusCode().is2xxSuccessful();

        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }

    /**
     * Envía credenciales usando EmailJS (reemplaza el método de Mailjet)
     * @param userEmail Email del usuario
     * @param credentials Lista de credenciales por sistema
     * @param loginUrl URL de acceso
     * @return true si se envió correctamente
     */
    public boolean sendCredentialsEmail(String userEmail, List<SystemCredentialDTO> credentials, String loginUrl) {
        try {
            // Generar contraseña temporal (usar la primera credencial como ejemplo)
            String generatedPassword = credentials.isEmpty() ? 
                generateRandomPassword() : 
                credentials.get(0).password();

            return sendVerificationEmail(userEmail, generatedPassword, loginUrl);

        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }

    /**
     * Genera una contraseña aleatoria segura
     * @return Contraseña generada
     */
    private String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder password = new StringBuilder();
        
        for (int i = 0; i < 10; i++) {
            password.append(chars.charAt((int) (Math.random() * chars.length())));
        }
        
        return password.toString();
    }

    /**
     * Valida formato de email
     * @param email Email a validar
     * @return true si es válido
     */
    public boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        return email.matches(emailRegex);
    }
}
