package com.gestor.GestorClientes.service;

import com.gestor.GestorClientes.persistence.entity.UserEntity;
import com.gestor.GestorClientes.persistence.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserDetailServiceImp implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String usuario) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByUsername(usuario)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + usuario));

        // Usamos sistema_id como rol
        String rol = "ROLE_" + user.getRolId(); // Ej: "ROLE_16"

        return new User(
                user.getUsername(),        // el campo `usuarios` en DB
                user.getPassword(),
                user.getActivo() != null && user.getActivo(), // enabled
                true,  // accountNonExpired
                true,  // credentialsNonExpired
                true,  // accountNonLocked
                Collections.singletonList(new SimpleGrantedAuthority(rol))
        );
    }

    public UserEntity getUserByPlayerId(String playerId) {
        return userRepository.findById(playerId)
                .orElseThrow(() -> new IllegalArgumentException("El usuario con player_id " + playerId + " no existe."));
    }

    // Si después agregas edición de usuarios desde el frontend, podrías extender con un método updateUser similar
}
