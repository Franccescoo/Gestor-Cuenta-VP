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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public AuthResponse loginUser(LoginRequestDTO authLoginRequest) {
        String email = authLoginRequest.username();
        String password = authLoginRequest.password();

        Authentication authentication = this.authenticate(email, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = jwtUtils.createToken(authentication);

        // Buscar el usuario completo para obtener el sistema_id
        UserEntity user = userRepository.findByUsername(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        // Buscar el nombre del sistema
        String sistemaNombre = sistemaRepository.findById(user.getRolId())
                .map(s -> s.getNombre())
                .orElse("Desconocido");

        return new AuthResponse(email, "User logged in successfully", accessToken, true, sistemaNombre);
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
