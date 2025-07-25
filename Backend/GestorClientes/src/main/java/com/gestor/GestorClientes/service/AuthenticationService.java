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

        // 1. Autentica
        Authentication authentication = this.authenticate(email, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 2. Buscar el usuario completo para obtener el playerId y sistemaId
        UserEntity user = userRepository.findByUsername(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        // 3. Buscar el sistema
        Integer sistemaId = user.getRolId();  // o getSistemaId()
        String sistemaNombre = sistemaRepository.findById(sistemaId)
                .map(s -> s.getNombre())
                .orElse("Desconocido");

        // 4. Genera el token con los datos correctos (puedes agregar sistemaId como claim si quieres)
        String accessToken = jwtUtils.createToken(
                authentication,
                user.getPlayerId(),
                sistemaId,
                sistemaNombre
        );


        // 5. Lógica para saber si debe completar el registro (ajusta según tus reglas)
        boolean debeCompletarRegistro = (
                isNullOrEmpty(user.getNombreCompleto()) ||
                        isNullOrEmpty(user.getApellidoCompleto()) ||
                        user.getFechaCumpleanos() == null ||
                        isNullOrEmpty(user.getEmail()) ||
                        isNullOrEmpty(user.getCelular()) ||
                        isNullOrEmpty(user.getNumeroDocumento())
        );

        // 6. Devuelve el AuthResponse con los 7 parámetros
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
