package com.gestor.GestorClientes.service;

import com.gestor.GestorClientes.controller.dto.SystemCredentialDTO;

import java.util.List;

public interface CredentialService {
    List<SystemCredentialDTO> processEmail(String email);
}
