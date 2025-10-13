import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, ModalController } from '@ionic/angular';
import { DpaSector } from 'src/app/models/DpaSector.model';
import { UserPerfilDTO, ActualizarUsuarioRequest } from 'src/app/models/UserPerfilDTOResponse.model';
import { AuthService } from 'src/app/Service/auth.service';
import { ChileDpaService } from 'src/app/Service/ChileDpaService.service';
import { DashboardService } from 'src/app/Service/DashboardService.service';
import { UserService } from 'src/app/Service/user.service';
import { ModalSolicitarCambioComponent } from 'src/app/components/modal-solicitar-cambio/modal-solicitar-cambio.component';
import {
  Observable, of, startWith, switchMap, withLatestFrom, distinctUntilChanged,
  Subject, takeUntil, merge, map, shareReplay
} from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit, OnDestroy {
  form!: FormGroup;

  perfil?: UserPerfilDTO;
  cargado = false;
  isEditing = false;

  defaultAvatar = 'assets/avatars/default.png';
  avatarPreview: string | null = null;
  fotoArchivo: File | null = null;

  toStr = (v: any) => String(v);

  private playerId!: string;
  private sistemaId!: number;
  private refreshComunas$ = new Subject<void>();

  private ultimasComunas: DpaSector[] = [];               // << cache
  compareById = (a: any, b: any) => String(a ?? '') === String(b ?? ''); // << para ion-select

  // Fecha (selects)
  diasDisponibles: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  mesesDisponibles: string[] = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
  ];
  aniosDisponibles: number[] = [];

  // DPA CHILE
  regiones$!: Observable<DpaSector[]>;
  comunas$!: Observable<DpaSector[]>;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dash: DashboardService,
    private toast: ToastController,
    private auth: AuthService,
    private cl: ChileDpaService,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    // ===== Formulario
    this.form = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.maxLength(80)]],
      apellidoCompleto: ['', [Validators.required, Validators.maxLength(80)]],

      // fecha (no editable)
      fechaDia: [{ value: null, disabled: true }],
      fechaMes: [{ value: null, disabled: true }],
      fechaAnio: [{ value: null, disabled: true }],

      email: [{ value: '', disabled: true }, [Validators.email]],
      celular: [''],

      login: [{ value: '', disabled: true }],

      tipoDocumento: [{ value: null, disabled: true }],
      numeroDocumento: [{ value: '', disabled: true }],

      // País + DPA
      pais: ['Chile'],
      regionCodigo: [null],   // guardaremos SIEMPRE como string
      comunaCodigo: [null],   // guardaremos SIEMPRE como string
      region: [''],
      comuna: [''],

      // Dirección
      calle: ['', [Validators.maxLength(100)]],
      numero: ['', [Validators.maxLength(20)]],
      notaEntrega: ['', [Validators.maxLength(300)]],

      verificado: [false],
      activo: [true]
    });

    // Solo-lectura inicial
    this.form.disable();

    // años 18–100 (solo para mostrar la fecha no editable ya seteada)
    const yNow = new Date().getFullYear();
    const max = yNow - 18, min = yNow - 100;
    this.aniosDisponibles = Array.from({ length: (max - min + 1) }, (_, i) => max - i);

    // ===== Encadenado DPA CHILE
    const paisCtrl = this.form.get('pais')!;
    const regCtrl  = this.form.get('regionCodigo')!;
    const comCtrl  = this.form.get('comunaCodigo')!;

    this.regiones$ = paisCtrl.valueChanges.pipe(
      startWith(this.form.value.pais || 'Chile'),
      distinctUntilChanged(),
      switchMap(p => p === 'Chile' ? this.cl.getRegiones() : of([]))
    );

    this.comunas$ = merge(
      regCtrl.valueChanges,
      this.refreshComunas$.pipe(map(() => regCtrl.value))
    ).pipe(
      startWith(regCtrl.value),
      distinctUntilChanged(),
      switchMap(cod => cod ? this.cl.getComunasByRegion(cod) : of([])),
      map(list => {
        this.ultimasComunas = list;     // << cache
        return list;
      }),
      shareReplay(1)
    );

    // Si cambia país ≠ Chile, limpiar región/comuna
    paisCtrl.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(p => {
        if (p !== 'Chile') {
          this.form.patchValue({
            regionCodigo: null, comunaCodigo: null, region: '', comuna: ''
          }, { emitEvent: false });
        }
      });

    // Region: solo setea el nombre, NO borra comuna al editar
    regCtrl.valueChanges
      .pipe(withLatestFrom(this.regiones$), takeUntil(this.destroy$))
      .subscribe(([cod, regs]) => {
        const r = regs.find(x => String(x.codigo) === String(cod));
        this.form.patchValue({ region: r?.nombre || '' }, { emitEvent: false });
      });

    // Comuna: de código -> nombre
    comCtrl.valueChanges
      .pipe(withLatestFrom(this.comunas$), takeUntil(this.destroy$))
      .subscribe(([cod, coms]) => {
        const c = coms.find(x => String(x.codigo) === String(cod));
        this.form.patchValue({ comuna: c?.nombre || '' }, { emitEvent: false });
      });

    // ===== IDs desde el token, cargar perfil
    this.dash.getMeTokenData().pipe(takeUntil(this.destroy$)).subscribe({
      next: ids => {
        this.playerId = ids.playerId;
        this.sistemaId = ids.sistemaId;
        this.cargarPerfil();
      },
      error: async () => {
        (await this.toast.create({ message: 'No pude leer tu sesión', duration: 2200, color: 'danger' })).present();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ==== utilidades
  private norm = (s: string) =>
    (s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

  trByCodigo = (_: number, it: DpaSector) => String(it.codigo); // << string consistente

  // ===== Carga / patch
  private cargarPerfil(): void {
    this.cargado = false;
    this.userService.getPerfil(this.playerId, this.sistemaId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (p) => {
          this.perfil = p;
          this.patchFromPerfil();
          this.cargado = true;
        },
        error: async () => {
          this.cargado = true;
          (await this.toast.create({ message: 'No se pudo cargar el perfil', duration: 2200, color: 'danger'})).present();
        }
      });
  }

  private patchFromPerfil(): void {
    if (!this.perfil) return;

    this.form.patchValue({
      nombreCompleto: this.perfil.nombreCompleto ?? '',
      apellidoCompleto: this.perfil.apellidoCompleto ?? '',
      email: this.perfil.email ?? '',
      celular: this.perfil.celular ?? '',
      login: this.perfil.login ?? '',
      tipoDocumento: this.perfil.tipoDocumento ?? null,
      numeroDocumento: this.perfil.numeroDocumento ?? '',
      verificado: this.perfil.verificado ?? false,
      activo: this.perfil.activo ?? true,

      // Dirección (nombres)
      pais: this.perfil.pais ?? 'Chile',
      region: this.perfil.region ?? '',
      comuna: this.perfil.comuna ?? '',
      calle: this.perfil.calle ?? '',
      numero: this.perfil.numero ?? '',
      notaEntrega: this.perfil.notaEntrega ?? ''
    }, { emitEvent: false });

    // fecha solo visual
    if (this.perfil.fechaCumpleanos) {
      const [yy, mm, dd] = this.perfil.fechaCumpleanos.split('-').map(Number);
      this.form.patchValue({ fechaAnio: yy, fechaMes: mm, fechaDia: dd }, { emitEvent: false });
    } else {
      this.form.patchValue({ fechaAnio: null, fechaMes: null, fechaDia: null }, { emitEvent: false });
    }
    this.actualizarDias(this.form.value.fechaAnio, this.form.value.fechaMes);

    // readonly reales
    ['email', 'login', 'tipoDocumento', 'numeroDocumento', 'fechaDia', 'fechaMes', 'fechaAnio'].forEach(c =>
      this.form.get(c)?.disable()
    );

    // Preseleccionar códigos desde los nombres solo si estamos en Chile y hay región/comuna guardadas
    if ((this.form.value.pais || 'Chile') === 'Chile' && this.perfil.region) {
      this.cl.getRegiones().pipe(
        switchMap(regs => {
          const r = regs.find(x => this.norm(x.nombre) === this.norm(this.perfil!.region!));
          if (!r) return of<DpaSector[] | null>(null);
          this.form.patchValue({ regionCodigo: String(r.codigo) }, { emitEvent: true });
          return this.cl.getComunasByRegion(r.codigo);
        }),
        takeUntil(this.destroy$)
      ).subscribe(comunas => {
        if (!comunas) return;
        const c = comunas.find(x => this.norm(x.nombre) === this.norm(this.perfil!.comuna || ''));
        if (c) this.form.patchValue({ comunaCodigo: String(c.codigo) }, { emitEvent: false });
      });
    }
  }

  private actualizarDias(y: number | null, m: number | null) {
    const days = (y && m) ? new Date(y, m, 0).getDate() : 31;
    this.diasDisponibles = Array.from({ length: days }, (_, i) => i + 1);
  }

  // ===== UI acciones
  toggleEditar(): void {
    this.isEditing = true;
    this.form.enable();
    // seguir dejando deshabilitados los readonly
    ['email','login','tipoDocumento','numeroDocumento','fechaDia','fechaMes','fechaAnio']
      .forEach(c => this.form.get(c)?.disable());

    // refresca comunas para la región actual sin perder la selección
    this.refreshComunas$.next();
  }

  cancelar(): void {
    this.isEditing = false;
    this.avatarPreview = null;
    this.fotoArchivo = null;
    this.patchFromPerfil();
    this.form.disable();
  }

  // ===== Guardar
  async guardar(): Promise<void> {
    if (!this.perfil) return;

    if (this.form.invalid) {
      (await this.toast.create({ message: 'Revisa los campos', duration: 2000, color: 'warning'})).present();
      return;
    }

    const v = this.form.getRawValue();

    // Fallback: si hay comunaCodigo pero el nombre quedó vacío, resuélvelo con el cache
    if ((!v.comuna || !v.comuna.trim()) && v.comunaCodigo && this.ultimasComunas?.length) {
      const c = this.ultimasComunas.find(x => String(x.codigo) === String(v.comunaCodigo));
      if (c) v.comuna = c.nombre;
    }

    // Nunca sobreescribas con null si ya había valor en el perfil
    const regionFinal = (v.region && v.region.trim()) ? v.region : (this.perfil.region ?? null);
    const comunaFinal = (v.comuna && v.comuna.trim()) ? v.comuna : (this.perfil.comuna ?? null);

    const payload: ActualizarUsuarioRequest = {
      nombreCompleto: v.nombreCompleto,
      apellidoCompleto: v.apellidoCompleto,
      fechaCumpleanos: this.perfil.fechaCumpleanos ?? null,  // no editable
      celular: v.celular,
      verificado: v.verificado,
      activo: v.activo,

      // Dirección / DPA (nombres)
      pais: v.pais || 'Chile',
      region: regionFinal,
      comuna: comunaFinal,
      calle: v.calle || null,
      numero: v.numero || null,
      notaEntrega: v.notaEntrega || null,
    };

    this.userService.actualizarUsuario(this.playerId, this.sistemaId, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async (p: UserPerfilDTO) => {
          this.perfil = { ...this.perfil!, ...p };
          this.isEditing = false;
          this.patchFromPerfil();
          this.form.disable();
          const t = await this.toast.create({ message: 'Perfil actualizado', duration: 1200, color: 'success' });
          await t.present();
          window.location.reload(); // si lo quieres mantener
        },
        error: async () => {
          (await this.toast.create({ message: 'Error al actualizar', duration: 2200, color: 'danger'})).present();
        }
      });
  }

  // ===== Foto
  onFotoSeleccionada(ev: Event): void {
    if (!this.isEditing) return;
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.fotoArchivo = file;
    const reader = new FileReader();
    reader.onload = () => (this.avatarPreview = reader.result as string);
    reader.readAsDataURL(file);
  }

  onImgError(ev: Event) {
    const dataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
        <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#d4af37"/><stop offset="1" stop-color="#f3d98b"/></linearGradient></defs>
        <rect width="100%" height="100%" fill="#141414"/>
        <circle cx="128" cy="128" r="98" fill="none" stroke="url(#g)" stroke-width="8"/>
        <circle cx="128" cy="108" r="40" fill="#1a1a1a"/>
        <path d="M64 200c10-36 48-52 64-52s54 16 64 52" fill="#1a1a1a"/>
      </svg>`);
    (ev.target as HTMLImageElement).src = dataUrl;
  }

  get fechaSeleccionadaCompleta(): boolean {
  if (!this.form) return false;
  const { fechaDia, fechaMes, fechaAnio } = this.form.value || {};
  return !!(fechaDia && fechaMes && fechaAnio);
}

get fechaNacimientoValida(): boolean {
  if (!this.form) return true;
  const y = this.form.value.fechaAnio;
  const m = this.form.value.fechaMes;
  const d = this.form.value.fechaDia;
  if (!y || !m || !d) return true;

  const dt = new Date(y, m - 1, d);
  const ok = dt.getFullYear() === y && dt.getMonth() === (m - 1) && dt.getDate() === d;
  if (!ok) return false;

  const hoy = new Date();
  const edad =
    hoy.getFullYear() - y -
    ((hoy.getMonth() + 1 < m) || (hoy.getMonth() + 1 === m && hoy.getDate() < d) ? 1 : 0);
  return edad >= 18 && edad <= 100;
}

  // ===== Métodos para solicitudes de cambio
  async solicitarCambio(campo: string): Promise<void> {
    if (!this.perfil) {
      (await this.toast.create({ 
        message: 'No se pudo cargar la información del perfil', 
        duration: 2200, 
        color: 'danger'
      })).present();
      return;
    }

    const modal = await this.modalController.create({
      component: ModalSolicitarCambioComponent,
      componentProps: {
        perfil: this.perfil
      },
      cssClass: 'modal-solicitud-cambio'
    });

    await modal.present();
  }

  irAMisSolicitudes(): void {
    this.router.navigate(['/mis-solicitudes']);
  }
}
