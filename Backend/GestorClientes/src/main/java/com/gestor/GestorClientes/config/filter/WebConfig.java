package com.gestor.GestorClientes.config.filter;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:8100",  // Frontend Angular/Ionic
                        "http://localhost:4200",  // Otro frontend posible
                        "http://localhost:8080",  // Solo si es otro backend
                        "http://localhost:8201",  // Frontend del back office (CalculoPuntos)
                        "https://prestige-club-2025.web.app",  // Frontend en producción
                        "https://betpoints-puntos.web.app",    // Frontend CalculoPuntos en producción
                        "https://prestigeclub.vip"             // Frontend principal en producción
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
