package com.gestor.GestorClientes.controller.dto;

public class CompletarRegistroRequest {
    public String playerId;           // o username
    public String nombreCompleto;
    public String apellidoCompleto;
    public String fechaCumpleanos;    // YYYY-MM-DD (parsea a LocalDate)
    public String email;
    public String celular;
    public String numeroDocumento;
    public String usuarios;           // nick (opcional)
    public String password;           // nueva contraseña (opcional)
}
