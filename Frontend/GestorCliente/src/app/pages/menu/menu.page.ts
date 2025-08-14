import { Component, OnInit } from '@angular/core';
import { Observable, of, combineLatest } from 'rxjs';
import { catchError, switchMap, tap, shareReplay, map, startWith } from 'rxjs/operators';
import { UserDashboardDTO } from '../../models/UserDashboardDTO.model';
import { BeneficioDTO } from '../../models/BeneficioDTO.model';
import { DashboardService } from 'src/app/Service/DashboardService.service';

type Vm = {
  beneficios: BeneficioDTO[];
  titulo: string;
  descripcion: string;
};

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  dash$!: Observable<UserDashboardDTO>;
  beneficios$!: Observable<BeneficioDTO[]>;
  vm$!: Observable<Vm>;

  constructor(private dashboard: DashboardService) {}

  ngOnInit(): void {
    // 1) Reutilizamos playerId/sistemaId
    const token$ = this.dashboard.getMeTokenData().pipe(
      tap(({ playerId, sistemaId }) => {
        localStorage.setItem('playerId', playerId);
        localStorage.setItem('sistema', String(sistemaId));
      }),
      shareReplay(1)
    );

    // 2) Dashboard
    this.dash$ = token$.pipe(
      switchMap(({ playerId, sistemaId }) =>
        this.dashboard.getDashboard(playerId, sistemaId)
      ),
      catchError(() =>
        of({
          playerId: localStorage.getItem('playerId') || '',
          sistemaId: Number(localStorage.getItem('sistema') || 0),
          nombre: null, email: null, puntos: 0,
          nivel: null, metaNivel: null, puntosFaltantes: null,
          progreso: 0, ultimaActualizacion: null
        } as UserDashboardDTO)
      ),
      shareReplay(1)
    );

    // 3) Beneficios
    this.beneficios$ = token$.pipe(
      switchMap(({ playerId, sistemaId }) =>
        this.dashboard.getBeneficios(playerId, sistemaId)
      ),
      catchError(() => of([])),
      shareReplay(1)
    );

    // 4) View-model para el template
    this.vm$ = combineLatest([
      this.dash$.pipe(startWith(null)),
      this.beneficios$.pipe(startWith([] as BeneficioDTO[]))
    ]).pipe(
      map(([d, beneficios]) => {
        const nivel = d?.nivel?.trim();
        const titulo = nivel
          ? `Beneficios Exclusivos ${nivel}`
          : 'Beneficios por categoría';
        const descripcion = nivel
          ? `Disfruta de ventajas únicas como miembro ${nivel}`
          : 'Aún no tienes categoría asignada';
        return { beneficios, titulo, descripcion };
      })
    );
  }
}
