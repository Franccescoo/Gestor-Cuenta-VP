import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { DpaSector } from 'src/app/models/DpaSector.model';
import { UserPerfilDTO, ActualizarUsuarioRequest } from 'src/app/models/UserPerfilDTOResponse.model';
import { AuthService } from 'src/app/Service/auth.service';
import { ChileDpaService } from 'src/app/Service/ChileDpaService.service';
import { DashboardService } from 'src/app/Service/DashboardService.service';
import { UserService } from 'src/app/Service/user.service';
import { Observable, of, startWith, switchMap, withLatestFrom, distinctUntilChanged,
         Subject, takeUntil, merge, map, shareReplay } from 'rxjs';

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

  private playerId!: string;
  private sistemaId!: number;
private refreshComunas$ = new Subject<void>();

  // Fecha (selects)
  diasDisponibles: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  mesesDisponibles: string[] = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
  ];
  aniosDisponibles: number[] = [];

  // DPA CHILE (solo región y comuna)
  regiones$!: Observable<DpaSector[]>;
  comunas$!: Observable<DpaSector[]>;

  // unsubscribe
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dash: DashboardService,
    private toast: ToastController,
    private auth: AuthService,
    private cl: ChileDpaService,
  ) {}

  ngOnInit(): void {
    // ===== Formulario
    this.form = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.maxLength(80)]],
      apellidoCompleto: ['', [Validators.required, Validators.maxLength(80)]],

      // fecha
      fechaDia: [null],
      fechaMes: [null],
      fechaAnio: [null],

      email: [{ value: '', disabled: true }, [Validators.email]],
      celular: [''],

      login: [{ value: '', disabled: true }],

      tipoDocumento: [{ value: null, disabled: true }],
      numeroDocumento: [{ value: '', disabled: true }],

      // País + DPA
      pais: ['Chile'],
      regionCodigo: [null],
      comunaCodigo: [null],
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

    // años 18–100
    const yNow = new Date().getFullYear();
    const max = yNow - 18, min = yNow - 100;
    this.aniosDisponibles = Array.from({ length: (max - min + 1) }, (_, i) => max - i);

    // recalcular días mes/año
    this.form.get('fechaMes')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateDiasDisponibles());
    this.form.get('fechaAnio')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateDiasDisponibles());

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
  regCtrl.valueChanges,                          // cuando cambia la región
  this.refreshComunas$.pipe(map(() => regCtrl.value)) // fuerza reemisión con la región actual
).pipe(
  startWith(regCtrl.value),                      // al (re)suscribirse
  distinctUntilChanged(),
  switchMap(cod => cod ? this.cl.getComunasByRegion(cod) : of([])),
  shareReplay(1)                                 // cachea último listado
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

// Nombres hacia BD (region y, solo si estás editando, limpia comuna)
regCtrl.valueChanges
  .pipe(withLatestFrom(this.regiones$), takeUntil(this.destroy$))
  .subscribe(([cod, regs]) => {
    const r = regs.find(x => x.codigo === cod);

    // siempre actualiza el nombre de la región
    const base = { region: r?.nombre || '' };

    // solo limpia comuna cuando el usuario realmente está editando
    const clearIfEditing = this.isEditing ? { comunaCodigo: null, comuna: '' } : {};

    this.form.patchValue({ ...base, ...clearIfEditing }, { emitEvent: false });
  });


    comCtrl.valueChanges
      .pipe(withLatestFrom(this.comunas$), takeUntil(this.destroy$))
      .subscribe(([cod, coms]) => {
        const c = coms.find(x => x.codigo === cod);
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

  // ===== helpers
  get fechaSeleccionadaCompleta(): boolean {
    const { fechaDia, fechaMes, fechaAnio } = this.form.value;
    return !!(fechaDia && fechaMes && fechaAnio);
  }

  get fechaNacimientoValida(): boolean {
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

  private composeFechaFromSelects(): string | null {
    const { fechaDia, fechaMes, fechaAnio } = this.form.value;
    if (!fechaDia || !fechaMes || !fechaAnio) return null;
    const dd = String(fechaDia).padStart(2, '0');
    const mm = String(fechaMes).padStart(2, '0');
    return `${fechaAnio}-${mm}-${dd}`;
  }

  private updateDiasDisponibles(): void {
    const y = this.form.value.fechaAnio;
    const m = this.form.value.fechaMes;
    const days = (y && m) ? new Date(y, m, 0).getDate() : 31;
    this.diasDisponibles = Array.from({ length: days }, (_, i) => i + 1);
    const dSel = this.form.value.fechaDia;
    if (dSel && dSel > days) this.form.patchValue({ fechaDia: null }, { emitEvent: false });
  }

  private norm = (s: string) =>
    (s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

  trByCodigo = (_: number, it: DpaSector) => it.codigo;

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

      // Dirección
      pais: this.perfil.pais ?? 'Chile',
      region: this.perfil.region ?? '',
      comuna: this.perfil.comuna ?? '',
      calle: this.perfil.calle ?? '',
      numero: this.perfil.numero ?? '',
      notaEntrega: this.perfil.notaEntrega ?? ''
    }, { emitEvent: false });

    // fecha → selects
    if (this.perfil.fechaCumpleanos) {
      const [yy, mm, dd] = this.perfil.fechaCumpleanos.split('-').map(Number);
      this.form.patchValue({ fechaAnio: yy, fechaMes: mm, fechaDia: dd }, { emitEvent: false });
    } else {
      this.form.patchValue({ fechaAnio: null, fechaMes: null, fechaDia: null }, { emitEvent: false });
    }
    this.updateDiasDisponibles();

    // readonly reales
    ['email', 'login', 'tipoDocumento', 'numeroDocumento'].forEach(c =>
      this.form.get(c)?.disable()
    );

    // Preseleccionar códigos desde los nombres (si existen)
    if ((this.form.value.pais || 'Chile') === 'Chile' && this.perfil.region) {
      this.cl.getRegiones().pipe(
        switchMap(regs => {
          const r = regs.find(x => this.norm(x.nombre) === this.norm(this.perfil!.region!));
          if (!r) return of<DpaSector[] | null>(null);
          this.form.patchValue({ regionCodigo: r.codigo }, { emitEvent: true });
          return this.cl.getComunasByRegion(r.codigo);
        }),
        takeUntil(this.destroy$)
      ).subscribe(comunas => {
        if (!comunas) return;
        const c = comunas.find(x => this.norm(x.nombre) === this.norm(this.perfil!.comuna || ''));
        if (c) this.form.patchValue({ comunaCodigo: c.codigo }, { emitEvent: false });
      });
    }
  }

  // ===== UI acciones
toggleEditar(): void {
  this.isEditing = true;
  this.form.enable();
  ['email','login','tipoDocumento','numeroDocumento'].forEach(c => this.form.get(c)?.disable());
  this.refreshComunas$.next(); // << refresca comunas para la región actual
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
    if (this.fechaSeleccionadaCompleta && !this.fechaNacimientoValida) {
      (await this.toast.create({ message: 'Fecha de nacimiento inválida (18–100 años)', duration: 2200, color: 'warning'})).present();
      return;
    }

    const v = this.form.getRawValue();
    const fecha = this.composeFechaFromSelects();

    const payload: ActualizarUsuarioRequest = {
      nombreCompleto: v.nombreCompleto,
      apellidoCompleto: v.apellidoCompleto,
      fechaCumpleanos: fecha ?? this.perfil.fechaCumpleanos ?? null,
      celular: v.celular,
      verificado: v.verificado,
      activo: v.activo,

      // Dirección / DPA (solo región y comuna)
      pais: v.pais || 'Chile',
      region: v.region || null,
      comuna: v.comuna || null,
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
          (await this.toast.create({ message: 'Perfil actualizado', duration: 1800, color: 'success'})).present();
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
}
