package com.gestor.GestorClientes.service;


import com.gestor.GestorClientes.controller.dto.AuthResponse;
import com.gestor.GestorClientes.controller.dto.LoginRequestDTO;
import com.gestor.GestorClientes.persistence.entity.UserEntity;
import com.gestor.GestorClientes.persistence.repositories.SistemaRepository;
import com.gestor.GestorClientes.persistence.repositories.UserRepository;
import com.gestor.GestorClientes.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class AuthenticationService{
    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtils;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SistemaRepository sistemaRepository;

    public AuthResponse loginUser(LoginRequestDTO req) {
        String email = req.email();
        String password = req.password();

        // 1. Buscar todos los usuarios con ese email
        List<UserEntity> users = userRepository.findAllByEmail(email);

        if (users.isEmpty()) {
            throw new UsernameNotFoundException("Email no encontrado");
        }

        UserEntity userFound = null;

        // 2. Si hay más de uno, validar contraseña en cada uno
        for (UserEntity u : users) {
            if (passwordEncoder.matches(password, u.getPassword())) {
                userFound = u;
                break;
            }
        }

        if (userFound == null) {
            throw new BadCredentialsException("Contraseña incorrecta");
        }

        // 3. Autenticación (opcional si no usas AuthenticationManager)
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                userFound.getEmail(),
                userFound.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + userFound.getRolId()))
        );
        Authentication authentication =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 4. Datos del sistema
        Integer sistemaId = userFound.getRolId(); // o getSistemaId() si tienes esa columna
        String sistemaNombre = sistemaRepository.findById(sistemaId)
                .map(s -> s.getNombre())
                .orElse("Desconocido");

        // 5. Token
        String accessToken = jwtUtils.createToken(
                authentication,
                userFound.getPlayerId(),
                sistemaId,
                sistemaNombre
        );

        // 6. Debe completar registro
        boolean debeCompletarRegistro = (
                isNullOrEmpty(userFound.getNombreCompleto()) ||
                        isNullOrEmpty(userFound.getApellidoCompleto()) ||
                        userFound.getFechaCumpleanos() == null ||
                        isNullOrEmpty(userFound.getEmail()) ||
                        isNullOrEmpty(userFound.getCelular()) ||
                        isNullOrEmpty(userFound.getNumeroDocumento())
        );

        return new AuthResponse(
                email,
                "User logged in successfully",
                accessToken,
                true,
                sistemaId,
                sistemaNombre,
                debeCompletarRegistro
        );
    }


    // Método utilitario para chequear nulos o vacíos
    private boolean isNullOrEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }



    public Authentication authenticate(String email, String password) {
        UserDetails userDetails;
        try {
            userDetails = userDetailsService.loadUserByUsername(email);
        } catch (UsernameNotFoundException e) {
            throw new BadCredentialsException("Invalid username or password");
        }

        // ← ¡Agrega esta validación!
        if (!userDetails.isEnabled()) {
            throw new DisabledException("Usuario desactivado");
        }

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Incorrect Password");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, password, userDetails.getAuthorities());
    }


}
