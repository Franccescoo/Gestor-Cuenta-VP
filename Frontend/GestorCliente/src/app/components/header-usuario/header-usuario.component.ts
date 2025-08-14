import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-header-usuario',
  templateUrl: './header-usuario.component.html',
  styleUrls: ['./header-usuario.component.scss'],
})
export class HeaderUsuarioComponent  implements OnInit {
  currentYear: number = new Date().getFullYear();
  searchQuery: string = '';
  cartTotal: number = 0;
  cartItemCount: number = 0;
  currentIndex: number = 0;
  user: any = null;
menuOpen = false;


  constructor(
    private menuController: MenuController,
    private router: Router,
  ) { }

  ngOnInit() {
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


}
