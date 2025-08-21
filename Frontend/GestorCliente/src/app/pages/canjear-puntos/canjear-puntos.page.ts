import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoDTO } from 'src/app/models/ProductoDTO.model';
import { ProductoService } from 'src/app/Service/producto.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-canjear-puntos',
  templateUrl: './canjear-puntos.page.html',
  styleUrls: ['./canjear-puntos.page.scss'],
})
export class CanjearPuntosPage implements OnInit {
  loading = true;
  productos: ProductoDTO[] = [];
  filtered: ProductoDTO[] = [];
  categorias: { id: number; nombre: string; nivel: number | null }[] = [];

  // filtros
  filtersOpen = false;
  term = '';
  selectedCats = new Set<number>();
  onlyActive = true;

  // rango puntos
  minPts = 0;
  maxPts = 0;
  ptsLower = 0;
  ptsUpper = 0;
  stepPts = 50;

  sortBy: 'recomendado' | 'puntos-asc' | 'puntos-desc' | 'nombre-asc' | 'nombre-desc' = 'recomendado';

  skeletons = Array.from({ length: 10 });

  constructor(private productoSrv: ProductoService,private router: Router,) {}

  ngOnInit() {
    this.cargar();
  }

  private cargar() {
    this.loading = true;
    this.productoSrv.getProductos({ activo: true }).subscribe({
      next: (data) => {
        this.productos = data || [];
        this.categorias = this.extraerCategorias(this.productos);
        this.setupPuntosRange(this.productos);
        this.applyFilters();
      },
      error: (err) => {
        console.error(err);
        this.productos = [];
        this.filtered = [];
      },
      complete: () => (this.loading = false),
    });
  }

  private extraerCategorias(items: ProductoDTO[]) {
    const map = new Map<number, { id: number; nombre: string; nivel: number | null }>();
    items.forEach(p => {
      const c = p.categoria;
      if (c && !map.has(c.id)) map.set(c.id, { id: c.id, nombre: c.nombre, nivel: c.nivel ?? null });
    });
    return [...map.values()].sort((a, b) => (a.nivel ?? 999) - (b.nivel ?? 999));
  }

  private setupPuntosRange(items: ProductoDTO[]) {
    const pts = items.map(x => x.puntosCanje || 0);
    this.minPts = pts.length ? Math.min(...pts) : 0;
    this.maxPts = pts.length ? Math.max(...pts) : 0;
    if (this.maxPts < this.minPts) this.maxPts = this.minPts;
    this.ptsLower = this.minPts;
    this.ptsUpper = this.maxPts;
    const span = Math.max(1, this.maxPts - this.minPts);
    this.stepPts = Math.max(10, Math.round(span / 50));
  }

  onRangeChange(e: CustomEvent) {
    const val: any = e.detail.value;
    this.ptsLower = val.lower;
    this.ptsUpper = val.upper;
    this.applyFilters();
  }

  toggleCat(id: number, checked: boolean) {
    if (checked) this.selectedCats.add(id);
    else this.selectedCats.delete(id);
    this.applyFilters();
  }

  clearCats() {
    this.selectedCats.clear();
    this.applyFilters();
  }

  resetFilters() {
    this.term = '';
    this.selectedCats.clear();
    this.onlyActive = true;
    this.ptsLower = this.minPts;
    this.ptsUpper = this.maxPts;
    this.sortBy = 'recomendado';
    this.applyFilters();
  }

  applyFilters() {
    const term = this.term.trim().toLowerCase();

    this.filtered = this.productos
      .filter(p => {
        const catOk = this.selectedCats.size === 0 || (p.categoria && this.selectedCats.has(p.categoria.id));
        const termOk = !term || p.nombre?.toLowerCase().includes(term) || p.descripcion?.toLowerCase().includes(term);
        const activeOk = !this.onlyActive || p.activo;
        const pts = p.puntosCanje || 0;
        const rangeOk = pts >= this.ptsLower && pts <= this.ptsUpper;
        return catOk && termOk && activeOk && rangeOk;
      })
      .sort((a, b) => {
        switch (this.sortBy) {
          case 'puntos-asc':  return (a.puntosCanje||0) - (b.puntosCanje||0);
          case 'puntos-desc': return (b.puntosCanje||0) - (a.puntosCanje||0);
          case 'nombre-asc':  return (a.nombre||'').localeCompare(b.nombre||'');
          case 'nombre-desc': return (b.nombre||'').localeCompare(a.nombre||'');
          default: return 0;
        }
      });
  }

getImg(p: ProductoDTO): string {
  const raw = p.foto1 || p.foto2 || p.foto3;
  if (!raw) return '/assets/img/SinImagen.jpg';
  if (/^(data:image\/|https?:\/\/|blob:|\/assets\/)/i.test(raw)) return raw;
  if (/^[A-Za-z0-9+/=]+$/.test(raw) && raw.length > 200) return `data:image/jpeg;base64,${raw}`;
  const base = (environment.filesBase || '').replace(/\/$/, '');
  const file = raw.replace(/^\//, '');
  return `${base}/productos/${file}`;
}

fallbackImg(ev: Event) {
  const img = ev.target as HTMLImageElement;
  img.onerror = null;                    
  img.src = '/assets/img/SinImagen.jpg'; 
}




  formatMoney(costo: number, moneda?: string | null) {
    const curr = moneda || 'CLP';
    try {
      return new Intl.NumberFormat('es-CL', { style: 'currency', currency: curr as any, maximumFractionDigits: 0 }).format(costo);
    } catch {
      return `${costo} ${curr}`;
    }
  }

  canjear(p: ProductoDTO) {
    // Aquí conectas con tu flujo de canje (modal/route)
    console.log('Canjear', p.id);
    // this.router.navigate(['/detalle-canje', p.id]);
  }

  verDetalle(p: ProductoDTO) {
  this.router.navigate(['/detalle-producto', p.id], { state: { producto: p } });

  }

  onCatChange(id: number, ev: Event) {
  const checked = (ev.target as HTMLInputElement).checked;
  if (checked) this.selectedCats.add(id);
  else this.selectedCats.delete(id);
  this.applyFilters();
}

}
