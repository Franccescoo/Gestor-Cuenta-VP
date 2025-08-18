import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Service/user.service';

@Component({
  selector: 'app-info-usuario',
  templateUrl: './info-usuario.page.html',
  styleUrls: ['./info-usuario.page.scss'],
})
export class InfoUsuarioPage implements OnInit {
    sistema: number | null = null;
    usuario: any = {};
    minNacimiento: string = '';
    maxNacimiento: string = '';
    playerId: string = '';
    archivo: File | null = null;
    ocrText: string = '';
    cargandoOCR: boolean = false;
    menuOpen = false;
    fechaSeleccionada = { dia: '', mes: '', anio: '' };
  diasDisponibles: number[] = [];
  mesesDisponibles: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  aniosDisponibles: number[] = [];
  fechaNacimientoValida = true;

  countryCodes = [
    { code: 'cl', prefix: '+56', name: 'Chile' },
    { code: 'pe', prefix: '+51', name: 'Perú' },
  ];
  selectedCountry = this.countryCodes[0]; 

    constructor(
      private userService: UserService,
      private router: Router,
      private http: HttpClient
    ) {
      const hoy = new Date();
      const min = new Date(hoy.getFullYear() - 100, hoy.getMonth(), hoy.getDate());
      const max = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
      this.minNacimiento = min.toISOString().substring(0, 10);
      this.maxNacimiento = max.toISOString().substring(0, 10);
    }

    ngOnInit() {
      this.llenarAnios();
      this.llenarDias();
      this.usuario.tipoDocumento = this.usuario.tipoDocumento || 'rut';
    
      // Solo autoselecciona país por IP al principio, pero NO cambia tipoDocumento
      this.http.get<any>('https://ipapi.co/json/').subscribe(
        data => {
          let country = (data && data.country_code) ? data.country_code : 'CL';
          this.usuario.prefijo = (country === 'PE') ? '+51' : '+56';
        },
        error => {
          this.usuario.prefijo = '+56';
        }
      );
    
      // EXTRAER DATOS DEL TOKEN
      this.userService.obtenerTokenData().subscribe({
        next: (resp) => {
          this.playerId = resp.playerId;
          this.sistema = resp.sistemaId;
          // ... puedes setear username y otros si quieres ...
        },
        error: () => { alert('No se pudo obtener tus datos del token.'); }
      });
    }
    

    onChangePrefijo() {
      // Ya no cambia tipoDocumento, así usuario puede seleccionar el que quiera
    }

guardarRegistro() {
  // Asegura que playerId y sistemaId estén presentes
  if (!this.playerId || !this.sistema) {
    alert("Faltan datos de usuario o sistema");
    return;
  }

  // Construye el body solo con los campos del usuario (no incluyas playerId ni sistemaId)
  const data = {
    nombreCompleto: this.usuario.nombre_completo,
    apellidoCompleto: this.usuario.apellido_completo,
    fechaCumpleanos: this.usuario.fecha_cumpleanos,
    email: this.usuario.email,
    celular: this.usuario.celular.startsWith('+') ? this.usuario.celular : (this.usuario.prefijo + this.usuario.celular),
    numeroDocumento: this.usuario.numeroDocumento,
    tipoDocumento: this.usuario.tipoDocumento,
  };

  this.userService.actualizarUsuario(this.playerId, this.sistema, data).subscribe({
    next: (res) => {
      alert('¡Registro guardado!');
      this.router.navigate(['/menu']);
    },
    error: (err) => {
      alert('Error al guardar el registro');
    }
  });
}

    
    

    resetDocumento() {
      this.usuario.numeroDocumento = '';
    }

    onFileChange(event: any) {
      const file = event.target.files[0];
      if (file) {
        this.archivo = file;
        this.ocrText = '';
      }
    }



    // Helper para el input de documento
    getPattern() {
      switch (this.usuario.tipoDocumento) {
        case 'rut': return '^\\d{7,8}-[0-9kK]{1}$';
        case 'dni': return '^\\d{8}$';
        default: return '^[a-zA-Z0-9\\-]{4,20}$';
      }
    }
    getPlaceholder() {
      switch (this.usuario.tipoDocumento) {
        case 'rut': return 'Ej: 12345678-9';
        case 'dni': return 'Ej: 12345678';
        case 'extranjero-cl': return 'Otro documento válido (CL)';
        case 'extranjero-pe': return 'Otro documento válido (PE)';
        default: return 'Otro documento válido';
      }
    }
    getMaxLength() {
      switch (this.usuario.tipoDocumento) {
        case 'rut': return 10;
        case 'dni': return 8;
        default: return 20;
      }
    }

    llenarAnios() {
      const hoy = new Date();
      const anioActual = hoy.getFullYear();
      const anioMin = anioActual - 100;
      const anioMax = anioActual - 18;
      this.aniosDisponibles = [];
      for (let a = anioMax; a >= anioMin; a--) {
        this.aniosDisponibles.push(a);
      }
    }

    llenarDias() {
      // Por defecto, 31 días (el mes y año se ajustan abajo)
      this.diasDisponibles = Array.from({length: 31}, (_, i) => i + 1);
    }
    
    ngDoCheck() {
      // Ajusta días según mes y año seleccionado
      if (this.fechaSeleccionada.mes && this.fechaSeleccionada.anio) {
        // CONVIERTE a número usando + delante
        const diasEnMes = new Date(+this.fechaSeleccionada.anio, +this.fechaSeleccionada.mes, 0).getDate();
        this.diasDisponibles = Array.from({length: diasEnMes}, (_, i) => i + 1);
    
        // Corrige día si el actual ya no existe
        if (+this.fechaSeleccionada.dia > diasEnMes) {
          this.fechaSeleccionada.dia = '';
        }
      }
      this.validarFechaNacimiento();
    }

    validarFechaNacimiento() {
      const { dia, mes, anio } = this.fechaSeleccionada;
      if (dia && mes && anio) {
        // CONVIERTE a número aquí también
        const fecha = new Date(+anio, +mes - 1, +dia);
        const hoy = new Date();
        const edad = hoy.getFullYear() - fecha.getFullYear() - (hoy < new Date(hoy.getFullYear(), fecha.getMonth(), fecha.getDate()) ? 1 : 0);
        this.fechaNacimientoValida = (edad >= 18 && edad <= 100);
        this.usuario.fecha_cumpleanos = this.fechaNacimientoValida
          ? `${anio}-${('0' + mes).slice(-2)}-${('0' + dia).slice(-2)}`
          : '';
      } else {
        this.fechaNacimientoValida = true;
        this.usuario.fecha_cumpleanos = '';
      }
    }

    getFlagClass(): string {
      const c = this.countryCodes.find(c => c.prefix === this.usuario.prefijo);
      return 'fi fi-' + (c?.code || 'cl');
    }

    toggleMenu() {
  this.menuOpen = !this.menuOpen;
  document.body.classList.toggle('no-scroll', this.menuOpen);
}

closeMenu() {
  this.menuOpen = false;
  document.body.classList.remove('no-scroll');
}

goToLogin() {
  // navega a tu ruta de login
  this.router.navigate(['/iniciar-sesion']);
}



  }
