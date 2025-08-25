import { Component, OnInit } from '@angular/core';
import { HistorialCanjeDetalle } from 'src/app/models/HistorialCanjeDetalle.model';
import { HistorialCanjeService } from 'src/app/Service/HistorialCanjeService.service';

@Component({
  selector: 'app-historial-canjes',
  templateUrl: './historial-canjes.page.html',
  styleUrls: ['./historial-canjes.page.scss'],
})
export class HistorialCanjesPage implements OnInit {
  historial: HistorialCanjeDetalle[] = [];
  historialFiltrado: HistorialCanjeDetalle[] = [];

  filtroTipo: string = 'todos';
  ordenFecha: string = 'desc';

  constructor(private historialService: HistorialCanjeService) {}

  ngOnInit() {
    const playerId = "57201985"; // luego tomas del token
    const sistemaId = 1;

    this.historialService.getHistorialDetalle(playerId, sistemaId).subscribe(data => {
      this.historial = data;
      this.aplicarFiltros();
    });
  }

  aplicarFiltros() {
    let datos = [...this.historial];

    // filtro por tipo (cuando incluyas productos aquí filtras distinto)
    if (this.filtroTipo === 'beneficios') {
      datos = datos.filter(x => x.beneficio);
    } else if (this.filtroTipo === 'productos') {
      datos = datos.filter(x => !x.beneficio);
    }

    // orden por fecha
    datos.sort((a, b) => {
      const fechaA = new Date(a.fechaCanje).getTime();
      const fechaB = new Date(b.fechaCanje).getTime();
      return this.ordenFecha === 'desc' ? fechaB - fechaA : fechaA - fechaB;
    });

    this.historialFiltrado = datos;
  }
}
