import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HistorialCanjeDetalle } from 'src/app/models/HistorialCanjeDetalle.model';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/Service/auth.service';

@Component({
  selector: 'app-detalle-canje-modal',
  templateUrl: './detalle-canje-modal.component.html',
  styleUrls: ['./detalle-canje-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class DetalleCanjeModalComponent implements OnInit {
  @Input() canje!: HistorialCanjeDetalle;
  
  sistemaNombre: string = '';

  constructor(
    private modalController: ModalController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log('Modal de detalle cargado:', this.canje);
    this.obtenerNombreSistema();
  }

  obtenerNombreSistema() {
    // Obtener nombre del sistema desde JWT o localStorage
    const fromJwt = this.authService.getPayload?.()?.sistemaNombre as string | undefined;
    const fromStorage = localStorage.getItem('sistemaNombre') || undefined;
    const isText = (v?: string) => !!v && isNaN(Number(v));
    
    if (isText(fromJwt)) {
      this.sistemaNombre = fromJwt!;
    } else if (isText(fromStorage)) {
      this.sistemaNombre = fromStorage!;
    } else {
      this.sistemaNombre = `Sistema ${this.canje.sistemaId}`;
    }
  }

  cerrar() {
    this.modalController.dismiss();
  }

  getEstadoIcon(): string {
    switch (this.canje?.estado) {
      case 'APROBADO': return 'checkmark-circle';
      case 'PENDIENTE': return 'time';
      case 'RECHAZADO': return 'close-circle';
      default: return 'help-circle';
    }
  }

  getEstadoColor(): string {
    switch (this.canje?.estado) {
      case 'APROBADO': return 'success';
      case 'PENDIENTE': return 'warning';
      case 'RECHAZADO': return 'danger';
      default: return 'medium';
    }
  }

  getEstadoTexto(): string {
    switch (this.canje?.estado) {
      case 'APROBADO': return 'Canje aprobado';
      case 'PENDIENTE': return 'Canje pendiente';
      case 'RECHAZADO': return 'Canje rechazado';
      default: return 'Estado desconocido';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString || dateString.trim() === '') return 'Sin fecha';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  }
}
