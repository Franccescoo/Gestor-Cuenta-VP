package com.gestor.GestorClientes.config;

import com.gestor.GestorClientes.util.JwtUtil;
import com.gestor.GestorClientes.config.JwtValidation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtUtil jwtUtil;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> {
                    // --- PUBLICO: health checks
                    auth.requestMatchers(HttpMethod.GET, "/actuator/health").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/actuator/info").permitAll();
                    
                    // --- PUBLICO: auth
                    auth.requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll();
                    auth.requestMatchers(HttpMethod.POST, "/api/auth/send-credentials").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/api/auth/health-db").permitAll();

                    // --- PUBLICO: autenticación móvil
                    auth.requestMatchers(HttpMethod.POST, "/api/mobile/auth/login").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/api/mobile/auth/verify").permitAll();

                    // --- PUBLICO: estáticos / imágenes (ajusta a tus rutas reales)
                    auth.requestMatchers(HttpMethod.GET, "/productos/**", "/files/**", "/assets/**").permitAll();

                    // --- PUBLICO: APIs para el front
                    auth.requestMatchers(HttpMethod.GET, "/api/productos").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/api/players/*/systems/*/beneficios/catalogo").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/api/players/*/systems/*/dashboard").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/api/players/*/systems/*/beneficios").permitAll();

                    // --- PUBLICO: helpers de usuario que ya usas en el front
                    auth.requestMatchers(HttpMethod.PUT, "/api/usuarios/actualizar").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/api/usuarios/me/player-id").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/api/usuarios/me/token-data").permitAll();
                    auth.requestMatchers(HttpMethod.POST, "/api/usuarios/validar-doc").permitAll();

                    // Si quieres hacer público /api/usuarios/perfil coméntalo aquí:
                    // auth.requestMatchers(HttpMethod.GET, "/api/usuarios/perfil").permitAll();

                    // ADMINISTRACIÓN DE SOLICITUDES DE CAMBIO (para back office)
                    auth.requestMatchers(HttpMethod.GET, "/api/admin/solicitudes-cambio/**").hasAnyRole("ADMINISTRADOR");
                    auth.requestMatchers(HttpMethod.POST, "/api/admin/solicitudes-cambio/**").hasAnyRole("ADMINISTRADOR");

                    // --- lo demás: requiere JWT
                    auth.anyRequest().authenticated();
                })

                // Desactiva HTTP Basic para que no salga el popup del navegador
                .httpBasic(AbstractHttpConfigurer::disable)

                // Filtro JWT
                .addFilterBefore(new JwtValidation(jwtUtil), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // CORS para Ionic/Angular dev
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(Arrays.asList(
                "http://localhost:8100", // Ionic
                "http://localhost:8080",  // backend / mismo host para imágenes
                "http://localhost:8201",  // Frontend del back office (CalculoPuntos)
                "https://prestige-club-2025.web.app",  // Frontend en producción
                "https://betpoints-puntos.web.app",    // Frontend CalculoPuntos en producción
                "https://prestigeclub.vip"             // Frontend principal en producción
                // agrega "http://localhost:4200" si usas ng serve
        ));
        cfg.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE","OPTIONS"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return new CorsFilter(source);
    }
}
