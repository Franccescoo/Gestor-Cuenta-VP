package com.gestor.GestorClientes.service;

import com.gestor.GestorClientes.controller.dto.SystemCredentialDTO;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.time.Year;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MailjetService {

    // ===================== CONFIG =====================
    private final String API_KEY    = "c6b6bf56793eb1be985a0baf420b981c";
    private final String API_SECRET = "88ebca2845798418722f14d2ff012fe6";
    private final String MJ_URL     = "https://api.mailjet.com/v3.1/send";

    // Reemplaza por URLs públicas (CDN/S3/tu dominio)
    private static final String LOGO_URL = "https://i.imgur.com/GCRCjCe.png";
    private static final String HERO_URL = "https://i.imgur.com/jqE1deQ.png";
    private static final String SITE_URL = "https://tu-dominio.com";

    private final RestTemplate restTemplate = new RestTemplate();

    // ===================== CORE SEND =====================
    public boolean enviarCorreo(
            String fromEmail,
            String fromName,
            String toEmail,
            String toName,
            String subject,
            String htmlContent,
            String textContent
    ) {
        try {
            Map<String, Object> from = Map.of("Email", fromEmail, "Name", fromName);
            Map<String, Object> to = Map.of("Email", toEmail, "Name", (toName == null ? "" : toName));

            Map<String, Object> message = new LinkedHashMap<>();
            message.put("From", from);
            message.put("To", List.of(to));
            message.put("Subject", subject);
            if (textContent != null) message.put("TextPart", textContent);
            if (htmlContent != null) message.put("HTMLPart", htmlContent);

            Map<String, Object> payload = Map.of("Messages", List.of(message));

            String auth = resolveApiKey() + ":" + resolveApiSecret();
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.add("Authorization", "Basic " + encodedAuth);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(MJ_URL, entity, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }

    // ===================== PUBLIC API =====================

    /** Envía un correo con TODAS las credenciales por sistema (un solo email). */
    public boolean sendCredentials(String toEmail, List<SystemCredentialDTO> items) {
        String subject = "Credenciales para Canjear Puntos";

        String html = buildEmailHtmlPrestige(items, toEmail);      // ← pasa el email
        String text = buildCredentialsText(items, toEmail);         // ← idem

        String fromEmail = "consultas.puntos@gmail.com";
        String fromName  = "Prestige Club";

        return enviarCorreo(fromEmail, fromName, toEmail, "", subject, html, text);
    }


    /** (Opcional) Enviar solo una credencial, usando la misma plantilla. */
    public boolean enviarCredencialPorEmail(String emailDestino, String nombreUsuario, String password) {
        String subject = "Credenciales para Canjear Puntos";

        SystemCredentialDTO unico = new SystemCredentialDTO(
                0L, "Prestige Club", nombreUsuario, password, true
        );

        String html = buildEmailHtmlPrestige(List.of(unico), emailDestino); // ← usa el email
        String text = buildCredentialsText(List.of(unico), emailDestino);   // ← idem

        String fromEmail = "consultas.puntos@gmail.com";
        String fromName  = "Prestige Club";

        return enviarCorreo(fromEmail, fromName, emailDestino, nombreUsuario, subject, html, text);
    }



    // ===================== BUILDERS =====================

    /** Plantilla HTML dark + dorado (similar a tu landing). */
    private String buildEmailHtmlPrestige(List<SystemCredentialDTO> items, String emailDestinatario) {
        final String emailEsc = escape(emailDestinatario == null ? "" : emailDestinatario);

        // Lista de credenciales: Email + Password por sistema
        String itemsHtml = items.stream().map(it -> {
            String sistema = escape(it.sistemaNombre());
            String pass    = escape(it.password());
            String nueva   = it.generated() ? "<em style=\"color:#34d399;\">(nueva)</em>" : "";
            return """
               <li style="margin:8px 0;">
                 <span style="color:#d4af37;font-weight:600;">%s</span>
                 &nbsp;—&nbsp; Email:
                 <span style="font-family:Consolas,Menlo,monospace;background:#0b0b0b;padding:2px 6px;border-radius:6px;display:inline-block;color:#f5f5f5;">%s</span>
                 &nbsp;—&nbsp; Contraseña:
                 <span style="font-family:Consolas,Menlo,monospace;background:#0b0b0b;padding:2px 6px;border-radius:6px;display:inline-block;color:#f5f5f5;">%s</span>
                 &nbsp;%s
               </li>
               """.formatted(sistema, emailEsc, pass, nueva);
        }).collect(Collectors.joining());

        int year = Year.now().getValue();

        return String.format("""
            <!doctype html>
            <html lang="es">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>Prestige Club - Credenciales</title>
            </head>
            <body style="margin:0;padding:0;background:#0e0e0e;">
              <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background:#0e0e0e;">
                <tr>
                  <td align="center" style="padding:24px 0;">
                    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;">
                      
                      <!-- Logo -->
                      <tr>
                        <td align="left" style="padding:16px 24px;">
                          <img src="%s" alt="Prestige Club" style="height:40px;display:block;">
                        </td>
                      </tr>

                      <!-- Hero full-bleed -->
                      <tr>
                        <td style="padding:0;">
                          <img src="%s" alt="" width="600" style="display:block;width:100%%;height:auto;border-radius:12px;">
                        </td>
                      </tr>

                      <!-- Panel -->
                      <tr>
                        <td style="background:#1a1a1a;border-radius:12px;padding:24px;">
                          <h1 style="margin:0 0 8px 0;font-family:Poppins,Arial,Helvetica,sans-serif;font-size:26px;line-height:1.25;color:#d4af37;">
                            ¡Bienvenido/a a Prestige Club!
                          </h1>
                          <p style="margin:0 0 16px 0;font-family:Poppins,Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#e5e5e5;">
                            Aquí tienes tus credenciales por sistema. Guarda esta información en un lugar seguro.
                          </p>

                          <ul style="margin:0;padding-left:20px;font-family:Poppins,Arial,Helvetica,sans-serif;color:#e5e5e5;font-size:14px;line-height:1.7;">
                            %s
                          </ul>

                          <div style="height:1px;margin:18px 0;background:linear-gradient(90deg, rgba(212,175,55,0) 0%%, rgba(212,175,55,.7) 50%%, rgba(212,175,55,0) 100%%);"></div>

                          <p style="margin:0 0 18px 0;font-family:Poppins,Arial,Helvetica,sans-serif;font-size:14px;color:#b5b5b5;">
                            Puedes ingresar desde el siguiente enlace:
                          </p>

                          <!-- Botón -->
                          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 8px 0;">
                            <tr>
                              <td align="center" style="border-radius:8px;background:#d4af37;">
                                <a href="%s" style="display:inline-block;padding:12px 18px;font-family:Poppins,Arial,Helvetica,sans-serif;font-size:14px;color:#000;font-weight:600;">
                                  Ir a Prestige Club
                                </a>
                              </td>
                            </tr>
                          </table>

                          <p style="margin:12px 0 0 0;font-family:Poppins,Arial,Helvetica,sans-serif;font-size:12px;color:#8b8b8b;">
                            Si no solicitaste estas credenciales, ignora este mensaje.
                          </p>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="padding:18px 10px;text-align:center;font-family:Poppins,Arial,Helvetica,sans-serif;font-size:11px;color:#8b8b8b;">
                          © %d Prestige Club — Este correo es automático. No respondas a este mensaje.
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """, LOGO_URL, HERO_URL, itemsHtml, SITE_URL, year);
    }

    /** Texto plano de respaldo (deliverability + accesibilidad). */
    private String buildCredentialsText(List<SystemCredentialDTO> items, String emailDestinatario) {
        StringBuilder sb = new StringBuilder();
        sb.append("Email: ").append(nullSafe(emailDestinatario)).append("\n");
        sb.append("Credenciales por sistema:\n");
        for (SystemCredentialDTO it : items) {
            sb.append("- ").append(nullSafe(it.sistemaNombre()))
                    .append(" | Password: ").append(nullSafe(it.password()))
                    .append(it.generated() ? " (nueva)" : "")
                    .append("\n");
        }
        sb.append("\nAccede: ").append(SITE_URL);
        return sb.toString();
    }


    // ===================== UTILS =====================

    private String escape(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;");
    }

    private String nullSafe(String s) {
        return s == null ? "" : s;
    }

    private String resolveApiKey() {
        return (API_KEY != null && !API_KEY.isBlank()) ? API_KEY : "TU_API_KEY";
    }

    private String resolveApiSecret() {
        return (API_SECRET != null && !API_SECRET.isBlank()) ? API_SECRET : "TU_API_SECRET";
    }
}
