import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Service/auth.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {
  showPassword = false;
  usuario: string = '';
  password: string = '';
  

  constructor(
    private router: Router,
    private authService: AuthService
    ) { }

  ngOnInit() {
  }

  irAPagina() {
    if (!this.usuario || !this.password) {
      alert('Debes ingresar usuario y contraseña');
      return;
    }
  
    this.authService.login(this.usuario, this.password).subscribe({
      next: (res) => {
        if (res && res.status) {
          localStorage.setItem('token', res.jwt);
          localStorage.setItem('sistema', res.sistema);
          // Chequea si falta info
          if (res.debeCompletarRegistro) {
            this.router.navigate(['/bienvenida']);
          } else {
            this.router.navigate(['/menu']);
          }
        } else {
          alert(res?.message || 'Usuario o contraseña incorrectos');
        }
      },
      error: (err) => {
        alert('Error de autenticación');
      }
    });
    
  }
  


  togglePassword() {
    this.showPassword = !this.showPassword;
  }


}
