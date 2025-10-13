import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { NotificationService } from 'src/app/Service/notification.service';
import { Observable } from 'rxjs';

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
  
  // ✅ Contador de notificaciones no leídas
  unreadCount$: Observable<number>;
  
  // ✅ Modal de notificaciones
  showNotificationsModal = false;
  notifications: any[] = [];

  constructor(
    private menuController: MenuController,
    private router: Router,
    private notificationService: NotificationService
  ) { 
    // Suscribirse al contador de notificaciones
    this.unreadCount$ = this.notificationService.unreadCount$;
    
    // Suscribirse a las notificaciones para el modal
    this.notificationService.notifications$.subscribe(notificaciones => {
      this.notifications = notificaciones;
    });
  }

  ngOnInit() {
    // Cerrar modal al hacer clic fuera
    document.addEventListener('click', (event) => {
      if (this.showNotificationsModal) {
        const target = event.target as HTMLElement;
        if (!target.closest('.notification-container')) {
          this.closeNotificationsModal();
        }
      }
    });
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

// ✅ Función para abrir/cerrar modal de notificaciones
toggleNotificationsModal() {
  this.showNotificationsModal = !this.showNotificationsModal;
  console.log('🔔 Modal de notificaciones:', this.showNotificationsModal);
}

// ✅ Cerrar modal de notificaciones
closeNotificationsModal() {
  this.showNotificationsModal = false;
}

// ✅ Marcar notificación como leída
markNotificationAsRead(notificacion: any) {
  if (notificacion.id) {
    this.notificationService.markAsRead(notificacion.id);
  }
}

  // ✅ Ir a historial de canjes
  goToNotificationsPage() {
    this.closeNotificationsModal();
    this.router.navigate(['/historial-canjes']);
  }

// ✅ Obtener icono según tipo
getNotificationIcon(tipo: string): string {
  switch (tipo) {
    case 'CANJE_APROBADO':
      return 'checkmark-circle';
    case 'CANJE_RECHAZADO':
      return 'close-circle';
    default:
      return 'information-circle';
  }
}

// ✅ Obtener color según tipo
getNotificationColor(tipo: string): string {
  switch (tipo) {
    case 'CANJE_APROBADO':
      return 'success';
    case 'CANJE_RECHAZADO':
      return 'danger';
    default:
      return 'medium';
  }
}

// ✅ Formatear tiempo
formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `hace ${diffMins}m`;
  if (diffMins < 1440) return `hace ${Math.floor(diffMins / 60)}h`;
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
}

// ✅ TrackBy para ngFor
trackByFn(index: number, item: any): number {
  return item.id || index;
}


}
