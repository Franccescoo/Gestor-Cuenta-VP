import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Client, IMessage } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Notificacion } from '../models/Notificacion.model';

/**
 * Servicio para gestionar notificaciones en tiempo real.
 * 
 * Funcionalidades:
 * - Conexión WebSocket con el backend
 * - Recepción de notificaciones en tiempo real
 * - Gestión de notificaciones leídas/no leídas
 * - Contador de notificaciones no leídas
 * - Mostrar toasts cuando llega una notificación
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8080/api/notificaciones';
  private wsUrl = 'http://localhost:8080/ws';
  
  private stompClient: Client | null = null;
  private subscription: any = null;
  
  // Observable para el contador de notificaciones no leídas
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();
  
  // Observable para la lista de notificaciones
  private notificationsSubject = new BehaviorSubject<Notificacion[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  
  // Estado de conexión
  private connectedSubject = new BehaviorSubject<boolean>(false);
  public connected$ = this.connectedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private router: Router,
    private ngZone: NgZone
  ) {}

  /**
   * Conectar al WebSocket para recibir notificaciones en tiempo real.
   * 
   * @param playerId - ID del jugador
   * @param sistemaId - ID del sistema
   */
  connect(playerId: string, sistemaId: number): void {
    if (this.stompClient && this.stompClient.connected) {
      console.log('⚠️ Ya hay una conexión activa.');
      return;
    }

    console.log('🔌 Conectando a WebSocket...', { playerId, sistemaId });

    // Crear cliente STOMP
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.wsUrl) as any,
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // Configurar callback de conexión exitosa
    this.stompClient.onConnect = () => {
      console.log('✅ Conectado a WebSocket');
      this.connectedSubject.next(true);
      
      // Suscribirse al canal personal del usuario
      this.subscription = this.stompClient!.subscribe(
        `/user/${playerId}/queue/notificaciones`,
        (message: IMessage) => {
          this.onNotificationReceived(message);
        }
      );

      console.log(`📡 Suscrito a: /user/${playerId}/queue/notificaciones`);
      
      // Cargar notificaciones iniciales desde la BD
      this.loadNotifications(playerId, sistemaId);
    };

    // Configurar callback de error
    this.stompClient.onStompError = (frame) => {
      console.error('❌ Error WebSocket:', frame.headers['message']);
      console.error('Detalles:', frame.body);
    };

    // Activar conexión
    this.stompClient.activate();
  }

  /**
   * Desconectar del WebSocket.
   */
  disconnect(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
      console.log('🔌 Desconectado y limpiado');
    }

    this.connectedSubject.next(false);
  }

  /**
   * Callback cuando se recibe una notificación por WebSocket.
   */
  private onNotificationReceived(message: IMessage): void {
    this.ngZone.run(() => {
      try {
        const notificacion: Notificacion = JSON.parse(message.body);
        console.log('📬 Nueva notificación recibida:', notificacion);

        // Agregar a la lista de notificaciones
        const current = this.notificationsSubject.value;
        this.notificationsSubject.next([notificacion, ...current]);

        // Incrementar contador de no leídas
        this.unreadCountSubject.next(this.unreadCountSubject.value + 1);

        // Mostrar toast
        this.showNotificationToast(notificacion);
      } catch (error) {
        console.error('Error al procesar notificación:', error);
      }
    });
  }

  /**
   * Mostrar un toast cuando llega una notificación.
   */
  private async showNotificationToast(notif: Notificacion): Promise<void> {
    const color = notif.tipo === 'CANJE_APROBADO' ? 'success' : 
                  notif.tipo === 'CANJE_RECHAZADO' ? 'danger' : 'medium';
    
    const icon = notif.tipo === 'CANJE_APROBADO' ? 'checkmark-circle' : 
                 notif.tipo === 'CANJE_RECHAZADO' ? 'close-circle' : 'information-circle';

    const toast = await this.toastController.create({
      header: notif.titulo,
      message: notif.mensaje,
      duration: 6000,
      color: color,
      icon: icon,
      position: 'top',
      buttons: [
        {
          text: 'Ver',
          handler: () => {
            this.router.navigate(['/historial-canjes']);
          }
        },
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });

    await toast.present();
  }

  // ===== ENDPOINTS REST =====

  /**
   * Cargar todas las notificaciones desde el backend.
   */
  loadNotifications(playerId: string, sistemaId: number): void {
    this.http.get<Notificacion[]>(`${this.apiUrl}/${playerId}/${sistemaId}`)
      .subscribe({
        next: (notificaciones) => {
          this.notificationsSubject.next(notificaciones);
          
          // Contar no leídas
          const unreadCount = notificaciones.filter(n => !n.leida).length;
          this.unreadCountSubject.next(unreadCount);
          
          console.log(`📋 Cargadas ${notificaciones.length} notificaciones (${unreadCount} no leídas)`);
        },
        error: (err) => {
          console.error('Error al cargar notificaciones:', err);
        }
      });
  }

  /**
   * Obtener solo las notificaciones no leídas.
   */
  getUnreadNotifications(playerId: string, sistemaId: number): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.apiUrl}/${playerId}/${sistemaId}/no-leidas`);
  }

  /**
   * Obtener el contador de notificaciones no leídas.
   */
  getUnreadCount(playerId: string, sistemaId: number): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/${playerId}/${sistemaId}/count`);
  }

  /**
   * Marcar una notificación como leída.
   */
  markAsRead(notificationId: number): void {
    this.http.put(`${this.apiUrl}/${notificationId}/marcar-leida`, {})
      .subscribe({
        next: () => {
          // Actualizar en la lista local
          const current = this.notificationsSubject.value;
          const updated = current.map(n => 
            n.id === notificationId ? { ...n, leida: true } : n
          );
          this.notificationsSubject.next(updated);
          
          // Decrementar contador
          this.unreadCountSubject.next(Math.max(0, this.unreadCountSubject.value - 1));
        },
        error: (err) => {
          console.error('Error al marcar como leída:', err);
        }
      });
  }

  /**
   * Marcar todas las notificaciones como leídas.
   */
  markAllAsRead(playerId: string, sistemaId: number): void {
    this.http.put(`${this.apiUrl}/${playerId}/${sistemaId}/marcar-todas-leidas`, {})
      .subscribe({
        next: () => {
          // Actualizar en la lista local
          const current = this.notificationsSubject.value;
          const updated = current.map(n => ({ ...n, leida: true }));
          this.notificationsSubject.next(updated);
          
          // Resetear contador
          this.unreadCountSubject.next(0);
          
          console.log('✅ Todas las notificaciones marcadas como leídas');
        },
        error: (err) => {
          console.error('Error al marcar todas como leídas:', err);
        }
      });
  }
}

