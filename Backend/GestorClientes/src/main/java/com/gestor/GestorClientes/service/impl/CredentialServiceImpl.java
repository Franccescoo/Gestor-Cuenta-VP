package com.gestor.GestorClientes.service.impl;

import com.gestor.GestorClientes.controller.dto.SystemCredentialDTO;
import com.gestor.GestorClientes.persistence.entity.SistemaEntity;
import com.gestor.GestorClientes.persistence.entity.UserEntity;
import com.gestor.GestorClientes.persistence.repositories.SistemaRepository;
import com.gestor.GestorClientes.persistence.repositories.UserRepository;
import com.gestor.GestorClientes.service.CredentialService;
import com.gestor.GestorClientes.service.MailjetService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CredentialServiceImpl implements CredentialService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MailjetService mailerService;

    @Autowired
    private SistemaRepository sistemaRepository;

    @Autowired
    private PasswordEncoder encoder; // ⬅ Inyectar para hash

    private static final SecureRandom RNG = new SecureRandom();
    private static final String ALPHABET =
            "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$%";

    @Override
    @Transactional
    public List<SystemCredentialDTO> processEmail(String email) {
        List<UserEntity> usuarios = userRepository.findAllByEmailIgnoreCase(email);
        if (usuarios.isEmpty()) {
            throw new NoSuchElementException("Email no encontrado");
        }

        // Conteo de ocurrencias de contraseñas existentes
        Map<String, Long> ocurrencias = usuarios.stream()
                .map(UserEntity::getPassword)
                .filter(pw -> pw != null && !pw.isBlank())
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

        // Set de contraseñas en texto plano usadas en esta corrida
        Set<String> usadasEnEstaCorrida = new HashSet<>();

        List<SystemCredentialDTO> out = new ArrayList<>();
        usuarios.sort(Comparator.comparing(UserEntity::getRolId));

        for (UserEntity u : usuarios) {
            String rawPassword;
            boolean generated = false;

            String actualEnBD = u.getPassword();

            if (actualEnBD == null || actualEnBD.isBlank()) {
                // No tenía → generar nueva
                rawPassword = uniquePassword(usadasEnEstaCorrida);
                usadasEnEstaCorrida.add(rawPassword);
                u.setPassword(encoder.encode(rawPassword)); // Guardar hash
                generated = true;

            } else if (isBcrypt(actualEnBD)) {
                // Ya está en hash → generar nueva (no se puede recuperar)
                rawPassword = uniquePassword(usadasEnEstaCorrida);
                usadasEnEstaCorrida.add(rawPassword);
                u.setPassword(encoder.encode(rawPassword)); // Guardar nuevo hash
                generated = true;

            } else {
                // Texto plano (caso legado)
                long veces = ocurrencias.getOrDefault(actualEnBD, 0L);
                if (veces > 1 || usadasEnEstaCorrida.contains(actualEnBD)) {
                    rawPassword = uniquePassword(usadasEnEstaCorrida);
                    usadasEnEstaCorrida.add(rawPassword);
                    u.setPassword(encoder.encode(rawPassword));
                    generated = true;
                } else {
                    rawPassword = actualEnBD;
                    usadasEnEstaCorrida.add(rawPassword);
                    u.setPassword(encoder.encode(rawPassword)); // Migrar a hash
                }
            }

            Integer sistemaId = u.getRolId();
            String sistemaNombre = resolveSistemaNombre(sistemaId);

            out.add(new SystemCredentialDTO(
                    sistemaId == null ? null : sistemaId.longValue(),
                    sistemaNombre,
                    u.getUsername(),
                    rawPassword, // Texto limpio para el email
                    generated
            ));
        }

        userRepository.saveAll(usuarios);
        mailerService.sendCredentials(email, out);

        return out;
    }

    private String resolveSistemaNombre(Integer sistemaId) {
        if (sistemaId == null) return "Sistema";
        return sistemaRepository.findById(sistemaId)
                .map(SistemaEntity::getNombre)
                .orElse("Sistema " + sistemaId);
    }

    private String uniquePassword(Set<String> usadas) {
        String p;
        do { p = randomPassword(10); } while (usadas.contains(p));
        return p;
    }

    private String randomPassword(int len) {
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(ALPHABET.charAt(RNG.nextInt(ALPHABET.length())));
        }
        return sb.toString();
    }

    private boolean isBcrypt(String value) {
        return value != null && (value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$"));
    }
}
