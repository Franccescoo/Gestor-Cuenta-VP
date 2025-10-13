import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { NotificationService } from '../../Service/notification.service';
import { Notificacion } from '../../models/Notificacion.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class NotificacionesPage implements OnInit, OnDestroy {
  notificaciones: Notificacion[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadNotifications();
    this.subscribeToNotifications();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadNotifications() {
    // Cargar notificaciones existentes
    this.subscription.add(
      this.notificationService.notifications$.subscribe(notificaciones => {
        this.notificaciones = notificaciones;
      })
    );
  }

  private subscribeToNotifications() {
    // Suscribirse a nuevas notificaciones en tiempo real
    this.subscription.add(
      this.notificationService.notifications$.subscribe(notificaciones => {
        this.notificaciones = notificaciones;
      })
    );
  }

  async markAsRead(notificacion: Notificacion) {
    if (!notificacion.leida && notificacion.id) {
      this.notificationService.markAsRead(notificacion.id);
      
      const toast = await this.toastController.create({
        message: 'Notificación marcada como leída',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
    }
  }

  async markAllAsRead() {
    if (this.notificaciones.some(n => !n.leida)) {
      // Obtener playerId y sistemaId del primer usuario (esto debería venir del auth service)
      const playerId = '57201985'; // TODO: Obtener del auth service
      const sistemaId = 1;
      
      this.notificationService.markAllAsRead(playerId, sistemaId);
      
      const toast = await this.toastController.create({
        message: 'Todas las notificaciones marcadas como leídas',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
    }
  }

  getIconForType(tipo: string): string {
    switch (tipo) {
      case 'CANJE_APROBADO':
        return 'checkmark-circle';
      case 'CANJE_RECHAZADO':
        return 'close-circle';
      default:
        return 'information-circle';
    }
  }

  getColorForType(tipo: string): string {
    switch (tipo) {
      case 'CANJE_APROBADO':
        return 'success';
      case 'CANJE_RECHAZADO':
        return 'danger';
      default:
        return 'medium';
    }
  }

  getUnreadCount(): number {
    return this.notificaciones.filter(n => !n.leida).length;
  }

  trackByFn(index: number, item: Notificacion): number {
    return item.id || index;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
