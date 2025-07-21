import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Service/auth.service';
import { UserService } from 'src/app/Service/user.service';
// Import jQuery
import * as $ from 'jquery';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.page.html',
  styleUrls: ['./bienvenida.page.scss'],
})
export class BienvenidaPage implements OnInit {
  sistema = localStorage.getItem('sistema');
  usuario: any = {}; // Carga aquí los datos actuales si tienes
  fechaNacimiento: string = '';
  minNacimiento: string = '';
  maxNacimiento: string = '';


  constructor(
    private userService: UserService,
    private router: Router) {
      const hoy = new Date();
      const min = new Date(hoy.getFullYear() - 100, hoy.getMonth(), hoy.getDate());
      const max = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
  
      this.minNacimiento = min.toISOString().substring(0, 10);
      this.maxNacimiento = max.toISOString().substring(0, 10);
     }

  ngOnInit() {
    // Podrías cargar el usuario actual aquí
  }


  guardarRegistro() {
    const playerId = localStorage.getItem('playerId'); // O tu identificador
    const data = {
      playerId: playerId,
      nombreCompleto: this.usuario.nombre_completo,
      apellidoCompleto: this.usuario.apellido_completo,
      fechaCumpleanos: this.usuario.fecha_cumpleanos, // debe ser yyyy-MM-dd
      email: this.usuario.email,
      celular: this.usuario.celular,
      numeroDocumento: this.usuario.numero_documento,
      usuarios: this.usuario.usuarios,
      password: this.usuario.password
    };
    this.userService.completarRegistro(data).subscribe(
      res => {
        // Muestra mensaje y/o redirige
        alert('¡Registro guardado!');
        this.router.navigate(['/menu']);
      },
      err => {
        alert('Error al guardar el registro');
      }
    );
  }

  
}


