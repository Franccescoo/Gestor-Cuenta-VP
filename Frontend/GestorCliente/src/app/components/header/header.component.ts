import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

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

  onToggleMenu(): void {
    this.menuController.open().then(() => {
      console.log('Menu opened');
    }).catch(err => {
      console.error('Error opening menu:', err);
    });
  }
}
