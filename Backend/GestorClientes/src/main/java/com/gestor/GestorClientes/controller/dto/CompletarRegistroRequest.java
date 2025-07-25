// CompletarRegistroRequest.java
package com.gestor.GestorClientes.controller.dto;

public class CompletarRegistroRequest {
    public String nombreCompleto;
    public String apellidoCompleto;
    public String fechaCumpleanos;    // YYYY-MM-DD
    public String email;
    public String celular;
    public String numeroDocumento;
    public String tipoDocumento;
    public String usuarios;           // nick (opcional)
    public String password;           // opcional
}
