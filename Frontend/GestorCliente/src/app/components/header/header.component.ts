import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Service/auth.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  searchQuery: string = '';
  cartTotal: number = 0;
  cartItemCount: number = 0;
  currentIndex: number = 0;
  user: any = null;
  menuOpen = false;

  // ✅ Estado de autenticación
  isAuthenticated$: Observable<boolean>;
  private authState$ = new BehaviorSubject<boolean>(false);

  constructor(
    private menuController: MenuController,
    private router: Router,
    private authService: AuthService
  ) { 
    this.isAuthenticated$ = this.authState$.asObservable();
  }

  ngOnInit() {
    // ✅ Verificar estado de autenticación al inicializar
    this.checkAuthState();
    
    // ✅ Verificar expiración de sesión cada minuto
    setInterval(() => {
      this.checkAuthState();
    }, 60000); // 60 segundos
  }

  // ✅ Verificar estado de autenticación
  private checkAuthState(): void {
    const isAuth = this.authService.isAuthenticated();
    this.authState$.next(isAuth);
    
    // Si no está autenticado, limpiar datos de sesión
    if (!isAuth) {
      this.authService.logout();
    }
  }


  search(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/busqueda', this.searchQuery]);
    } else {
      console.log('Ingrese un término de búsqueda');
    }
  }

toggleMenu() {
  this.menuOpen = !this.menuOpen;
  document.body.classList.toggle('no-scroll', this.menuOpen);
}

closeMenu() {
  this.menuOpen = false;
  document.body.classList.remove('no-scroll');
}

goToLogin() {
  // navega a tu ruta de login
  this.router.navigate(['/iniciar-sesion']);
}

// ✅ Ir a la cuenta del usuario
goToAccount() {
  this.router.navigate(['/menu']);
}

// ✅ Cerrar sesión
logout() {
  this.authService.logout();
  this.authState$.next(false);
  this.router.navigate(['/inicio']);
}


}
