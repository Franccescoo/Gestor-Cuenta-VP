import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoDTO } from 'src/app/models/ProductoDTO.model';
import { ProductoService } from 'src/app/Service/producto.service';
import { environment } from 'src/environments/environment';

const PLACEHOLDER = '/assets/img/SinImagen.jpg';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
})
export class DetalleProductoPage implements OnInit {
  producto: ProductoDTO | null = null;

  imgs: string[] = [];
  idx = 0;
  activeImg = PLACEHOLDER;

  constructor(
    private ar: ActivatedRoute,
    private router: Router,
    private productoSrv: ProductoService
  ) {}

  ngOnInit() {
    // 1) Si viene por state, úsalo
    const s = history.state?.producto as ProductoDTO | undefined;
    if (s?.id) {
      this.setProducto(s);
      return;
    }

    // 2) Si no, busca por :id
    const idParam = this.ar.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (!isNaN(id)) {
      if ((this.productoSrv as any).getProductoById) {
        (this.productoSrv as any).getProductoById(id).subscribe((p: ProductoDTO) => this.setProducto(p));
      } else {
        this.productoSrv.getProductos({ activo: true }).subscribe(list => {
          const p = (list || []).find(x => x.id === id) || null;
          this.setProducto(p);
        });
      }
    } else {
      // sin id => vuelve a la lista
      this.goBack();
    }
  }

  private setProducto(p: ProductoDTO | null) {
    this.producto = p;

    // Siempre 3 slots: foto1, foto2, foto3
    const raws = [p?.foto1 ?? null, p?.foto2 ?? null, p?.foto3 ?? null];

    this.imgs = raws.map(r => {
      if (!r || String(r).trim() === '') return PLACEHOLDER;
      const src = this.toSrc(r);
      return src || PLACEHOLDER;
    });

    // por si algo raro dejó el array vacío
    if (this.imgs.length === 0) this.imgs = [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER];

    this.idx = 0;
    this.activeImg = this.imgs[0] || PLACEHOLDER;
  }

  private toSrc(raw: string): string {
    if (!raw) return PLACEHOLDER;
    if (/^(data:image\/|https?:\/\/|blob:|\/assets\/)/i.test(raw)) return raw;
    if (/^[A-Za-z0-9+/=]+$/.test(raw) && raw.length > 200) return `data:image/jpeg;base64,${raw}`;
    const base = (environment.filesBase || '').replace(/\/$/, '');
    const file = raw.replace(/^\//, '');
    return `${base}/productos/${file}`;
  }

  onImageError(ev: Event) {
    const img = ev.target as HTMLImageElement;
    img.onerror = null;
    img.src = PLACEHOLDER;
  }

  set(i: number) {
    if (i < 0 || i >= this.imgs.length) return;
    this.idx = i;
    this.activeImg = this.imgs[i] || PLACEHOLDER;
  }

  prev() {
    if (this.imgs.length <= 1) return;
    this.idx = (this.idx - 1 + this.imgs.length) % this.imgs.length;
    this.activeImg = this.imgs[this.idx] || PLACEHOLDER;
  }

  next() {
    if (this.imgs.length <= 1) return;
    this.idx = (this.idx + 1) % this.imgs.length;
    this.activeImg = this.imgs[this.idx] || PLACEHOLDER;
  }

  goBack() {
    this.router.navigateByUrl('/canjear-puntos');
  }

  formatMoney(costo: number | undefined, moneda?: string | null) {
    const curr = moneda || 'CLP';
    const val = costo ?? 0;
    try {
      return new Intl.NumberFormat('es-CL', { style: 'currency', currency: curr as any, maximumFractionDigits: 0 }).format(val);
    } catch {
      return `${val} ${curr}`;
    }
  }

  canjear(p: ProductoDTO) {
    console.log('Canjear', p.id);
    // aquí enlazas tu flujo real de canje
  }
}
