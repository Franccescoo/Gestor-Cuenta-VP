import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { UserService } from 'src/app/Service/user.service';

@Component({
  selector: 'app-cambio-pass',
  templateUrl: './cambio-pass.page.html',
  styleUrls: ['./cambio-pass.page.scss'],
})
export class CambioPassPage implements OnInit {
  form!: FormGroup;
  loading = false;
  ready = false;

  showPass = false;
  showConfirm = false;

  private playerId: string = '';
  private sistemaId: number = 0;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userSrv: UserService,
    private toast: ToastController
  ) {}

  ngOnInit() {
    this.form = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.mustMatch('newPassword', 'confirmPassword') }
    );

    // Cargar playerId y sistemaId desde el backend (claims del JWT)
    this.userSrv.obtenerPlayerIdYSistema().subscribe({
      next: (c) => {
        this.playerId = c.playerId;
        this.sistemaId = Number(c.sistemaId ?? 0);
        this.ready = true;
      },
      error: () => { this.ready = true; }
    });
  }

  private mustMatch(a: string, b: string) {
    return (group: AbstractControl) => {
      const x = group.get(a), y = group.get(b);
      if (!x || !y) return null;
      const mismatch = x.value !== y.value;
      if (mismatch) y.setErrors({ ...(y.errors || {}), mismatch: true });
      else if (y.hasError('mismatch')) {
        const { mismatch, ...rest } = y.errors || {};
        y.setErrors(Object.keys(rest).length ? rest : null);
      }
      return null;
    };
  }

  isTouched(ctrl: string) {
    const c = this.form.get(ctrl);
    return !!c && (c.touched || c.dirty);
  }

  async onSubmit() {
    if (!this.ready) return;
    if (this.form.invalid || this.form.get('confirmPassword')?.hasError('mismatch')) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.userSrv.changePassword(this.playerId, this.sistemaId, this.form.value.newPassword)
      .subscribe({
        next: async () => {
          this.loading = false;
          (await this.toast.create({ message: 'Contraseña actualizada ✅', duration: 1600, color: 'success' })).present();
          this.router.navigateByUrl('/perfil');
        },
        error: async (err) => {
          this.loading = false;
          (await this.toast.create({
            message: err?.error?.message || 'No se pudo actualizar',
            duration: 1800,
            color: 'danger'
          })).present();
        }
      });
  }

  goBack() { this.router.navigateByUrl('/perfil'); }
}
