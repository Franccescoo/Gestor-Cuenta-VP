import { Component, OnInit } from '@angular/core';
import { Observable, of, combineLatest, Subject } from 'rxjs';
import { catchError, switchMap, tap, shareReplay, map, startWith } from 'rxjs/operators';
import { UserDashboardDTO } from '../../models/UserDashboardDTO.model';
import { BeneficioDTO } from '../../models/BeneficioDTO.model';
import { DashboardService } from 'src/app/Service/DashboardService.service';
import { AuthService } from 'src/app/Service/auth.service';

type Vm = { beneficios: BeneficioDTO[]; titulo: string; descripcion: string; };

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  dash$!: Observable<UserDashboardDTO>;
  beneficios$!: Observable<BeneficioDTO[]>;
  vm$!: Observable<Vm>;
  casinoNombre$!: Observable<string>;

  /** Disparador de recargas (al entrar a la vista o tras logout/login) */
  private reload$ = new Subject<void>();

  constructor(
    private dashboard: DashboardService,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.buildStreams();
    this.reload$.next(); // primera carga
  }

  /** Ionic vuelve a llamar esto cada vez que la página entra al frente */
  ionViewWillEnter() {
    this.reload$.next();
  }

  private buildStreams(): void {
    // 1) playerId/sistemaId — se recalcula en cada reload
    const token$ = this.reload$.pipe(
      startWith(void 0),
      switchMap(() => this.dashboard.getMeTokenData()),
      tap(({ playerId, sistemaId }) => {
        localStorage.setItem('playerId', playerId);
        localStorage.setItem('sistemaId', String(sistemaId));
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    // 2) Dashboard
    this.dash$ = token$.pipe(
      switchMap(({ playerId, sistemaId }) =>
        this.dashboard.getDashboard(playerId, sistemaId)
      ),
      catchError(() =>
        of({
          playerId: localStorage.getItem('playerId') || '',
          sistemaId: Number(localStorage.getItem('sistemaId') || 0),
          nombre: null, email: null, puntos: 0,
          nivel: null, metaNivel: null, puntosFaltantes: null,
          progreso: 0, ultimaActualizacion: null
        } as UserDashboardDTO)
      ),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    // 3) Beneficios
    this.beneficios$ = token$.pipe(
      switchMap(({ playerId, sistemaId }) =>
        this.dashboard.getBeneficios(playerId, sistemaId)
      ),
      catchError(() => of([] as BeneficioDTO[])),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    // 4) Nombre del casino (JWT -> storage -> fallback)
    this.casinoNombre$ = token$.pipe(
      map(({ sistemaId }) => {
        const fromJwt = this.auth.getPayload?.()?.sistemaNombre as string | undefined;
        const fromStorage = localStorage.getItem('sistemaNombre') || undefined;
        const isText = (v?: string) => !!v && isNaN(Number(v));
        if (isText(fromJwt)) return fromJwt!;
        if (isText(fromStorage)) return fromStorage!;
        return `Sistema ${sistemaId}`; // o `#${sistemaId}`
      }),
      startWith(localStorage.getItem('sistemaNombre') || ''),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    // 5) View-model para la UI
    this.vm$ = combineLatest([
      this.dash$.pipe(startWith(null as UserDashboardDTO | null)),
      this.beneficios$.pipe(startWith([] as BeneficioDTO[]))
    ]).pipe(
      map(([d, beneficios]) => {
        const nivel = d?.nivel?.trim();
        return {
          beneficios,
          titulo: nivel ? `Beneficios Exclusivos ${nivel}` : 'Beneficios por categoría',
          descripcion: nivel
            ? `Disfruta de ventajas únicas como miembro ${nivel}`
            : 'Aún no tienes categoría asignada',
        } as Vm;
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }
}
