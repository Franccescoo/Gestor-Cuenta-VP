import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { UserPerfilDTO, ActualizarUsuarioRequest } from 'src/app/models/UserPerfilDTOResponse.model';
import { DashboardService } from 'src/app/Service/DashboardService.service';
import { UserService } from 'src/app/Service/user.service';



@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  form!: FormGroup;
  perfil?: UserPerfilDTO;           // ← ahora usamos el DTO camelCase
  cargado = false;
  defaultAvatar = 'assets/avatars/default.png';
  isEditing = false;
  avatarPreview: string | null = null;
  fotoArchivo: File | null = null;

  private playerId!: string;
  private sistemaId!: number;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dash: DashboardService,
    private toast: ToastController
  ) {}

  ngOnInit(): void {
    // Mantengo los nombres snake_case para no tocar tu HTML
    this.form = this.fb.group({
      nombre_completo: ['', [Validators.required, Validators.maxLength(80)]],
      apellido_completo: ['', [Validators.required, Validators.maxLength(80)]],
      fecha_cumpleanos: [null],

      email: [{ value: '', disabled: true }, [Validators.email]],
      celular: [''],

      login: [{ value: '', disabled: true }],

      tipo_documento: [null],
      numero_documento: [''],

      // Campos de dirección (si tu backend aún no los soporta, no los mandamos en el PUT)
      calle: [''],
      numero: [''],
      comuna: [''],
      region: [''],
      pais: [''],

      verificado: [false],
      activo: [true],
      nota_entrega: [''] // idem
    });

    // IDs desde el backend (token)
    this.dash.getMeTokenData().subscribe({
      next: ids => {
        this.playerId = ids.playerId;
        this.sistemaId = ids.sistemaId;
        this.cargarPerfil();
      },
      error: async () => {
        (await this.toast.create({ message: 'No pude leer tu sesión', duration: 2200, color: 'danger'})).present();
      }
    });
  }

  private cargarPerfil(): void {
    this.cargado = false;
    this.userService.getPerfil(this.playerId, this.sistemaId).subscribe({
      next: (p) => {
        this.perfil = p; // camelCase
        // Mapear DTO (camelCase) -> form (snake_case)
        this.form.patchValue({
          nombre_completo: p.nombreCompleto,
          apellido_completo: p.apellidoCompleto,
          fecha_cumpleanos: p.fechaCumpleanos,

          email: p.email,
          celular: p.celular,

          login: p.login,

          tipo_documento: p.tipoDocumento,
          numero_documento: p.numeroDocumento,

          // si luego los tienes en la API, los setearás aquí:
          // calle: p.calle,
          // numero: p.numero,
          // comuna: p.comuna,
          // region: p.region,
          // pais: p.pais,

          verificado: p.verificado ?? false,
          activo: p.activo ?? true,
          // nota_entrega: p.notaEntrega
        });

        // mantener email/login readonly
        this.form.get('email')?.disable();
        this.form.get('login')?.disable();

        this.cargado = true;
      },
      error: async () => {
        this.cargado = true;
        (await this.toast.create({ message: 'No se pudo cargar el perfil', duration: 2200, color: 'danger'})).present();
      }
    });
  }

  toggleEditar(): void {
    this.isEditing = true;
    this.form.enable();
    // mantener solo-lectura
    this.form.get('email')?.disable();
    this.form.get('login')?.disable();
  }

  cancelar(): void {
    this.isEditing = false;
    this.avatarPreview = null;
    this.fotoArchivo = null;
    this.cargarPerfil();
    this.form.disable();
  }

  onImgError(ev: Event) {
  // Fallback: avatar inline con aro dorado (no depende de archivos)
  const dataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#d4af37"/>
        <stop offset="1" stop-color="#f3d98b"/>
      </linearGradient>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="rgba(0,0,0,.5)"/>
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="#141414"/>
    <circle cx="128" cy="128" r="98" fill="none" stroke="url(#g)" stroke-width="8" filter="url(#shadow)"/>
    <circle cx="128" cy="108" r="40" fill="#1a1a1a" stroke="#2a2a2a" stroke-width="2"/>
    <path d="M64 200c10-36 48-52 64-52s54 16 64 52" fill="#1a1a1a" stroke="#2a2a2a" stroke-width="2"/>
  </svg>`);
  (ev.target as HTMLImageElement).src = dataUrl;
}

  async guardar(): Promise<void> {
    if (!this.perfil) return;

    // Mapear form (snake_case) -> payload (camelCase)
    const v = this.form.getRawValue();
    const payload: ActualizarUsuarioRequest = {
      nombreCompleto: v.nombre_completo,
      apellidoCompleto: v.apellido_completo,
      fechaCumpleanos: v.fecha_cumpleanos, // string (YYYY-MM-DD)
      // email/login quedan bloqueados si ya existen en BD
      celular: v.celular,
      tipoDocumento: v.tipo_documento,
      numeroDocumento: v.numero_documento,
      verificado: v.verificado,
      activo: v.activo,
      // campos que tu backend aún no procesa, mejor no enviarlos para evitar 400:
      // notaEntrega: v.nota_entrega,
      // calle: v.calle, numero: v.numero, comuna: v.comuna, region: v.region, pais: v.pais
    };

    this.userService.actualizarUsuario(this.playerId, this.sistemaId, payload).subscribe({
      next: async (p) => {
        // si tienes endpoint de foto, descomenta esto:
        // if (this.fotoArchivo) {
        //   await this.userService.subirFotoPerfil(this.playerId, this.fotoArchivo).toPromise();
        // }

        this.perfil = p;        // DTO actualizado
        this.isEditing = false;
        this.avatarPreview = null;
        this.fotoArchivo = null;
        this.form.disable();

        (await this.toast.create({ message: 'Perfil actualizado', duration: 1800, color: 'success'})).present();
      },
      error: async () =>
        (await this.toast.create({ message: 'Error al actualizar', duration: 2200, color: 'danger'})).present()
    });
  }

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
}
