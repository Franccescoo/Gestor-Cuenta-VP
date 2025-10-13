import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './Service/auth.service';
import { NotificationService } from './Service/notification.service';
import { DashboardService } from './Service/DashboardService.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public appPages = [
    { title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    // Conectar a WebSocket si el usuario está autenticado
    this.initializeNotifications();
  }

  ngOnDestroy(): void {
    // Desconectar al destruir el componente
    this.notificationService.disconnect();
  }

  /**
   * Inicializar notificaciones en tiempo real.
   */
  private initializeNotifications(): void {
    if (this.authService.isAuthenticated()) {
      // Obtener datos del usuario desde el token
      this.dashboardService.getMeTokenData().subscribe({
        next: (data) => {
          const { playerId, sistemaId } = data;
          console.log('🚀 Iniciando conexión de notificaciones...', { playerId, sistemaId });
          
          // Conectar al WebSocket
          this.notificationService.connect(playerId, sistemaId);
        },
        error: (err) => {
          console.error('❌ Error al obtener datos del usuario:', err);
        }
      });
    }
  }
}
