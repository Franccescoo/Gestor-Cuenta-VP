import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface Brand {
  name: string;
  logo: string;
}

interface PrestigeCard {
  id: 'silver'|'gold'|'black'|'platinum'|'diamond';
  name: string;
  level: 'SILVER'|'GOLD'|'BLACK'|'PLATINUM'|'DIAMANTE';
  color: 'silver'|'gold'|'black'|'platinum'|'diamond';
  img: string;      // miniatura de la tarjeta (carrusel)
  bg: string;       // FOTO grande de la tarjeta (fondo)
  detailImg?: string;
  active: boolean;
  progress?: number;
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  animations: [
    trigger('slideIn', [
      state('true',  style({ maxHeight: '800px', opacity: 1 })),
      state('false', style({ maxHeight: '0px',   opacity: 0 })),
      transition('false => true', animate('500ms ease-in')),
      transition('true  => false', animate('500ms ease-out')),
    ])
  ]
})
export class InicioPage implements OnInit {

  // Tarjetas (un solo arreglo, ya con imagen)
cards: PrestigeCard[] = [
  {
    id:'silver', name:'PRESTIGE', level:'SILVER', color:'silver',
    img:'/assets/prestige/silver.png',
    bg:'/assets/img/tarjetas/silver/foto2.png',   // << foto de fondo
    detailImg: '/assets/img/tarjetas/silver/foto1.png',
    active:true
  },
  {
    id:'gold', name:'PRESTIGE', level:'GOLD', color:'gold',
    img:'/assets/prestige/gold.png',
    bg:'/assets/img/tarjetas/gold/foto2.png',
    detailImg: '/assets/img/tarjetas/gold/foto1.png',
    active:false
  },
  {
    id:'black', name:'PRESTIGE', level:'BLACK', color:'black',
    img:'/assets/prestige/black.png',
    bg:'/assets/img/tarjetas/black/foto2.png',
    detailImg: '/assets/img/tarjetas/black/foto1.png',
    active:false, progress:60
  },
  {
    id:'platinum', name:'PRESTIGE', level:'PLATINUM', color:'platinum',
    img:'/assets/prestige/platinum.png',
    bg:'/assets/img/tarjetas/platinum/foto2.png',
    detailImg: '/assets/img/tarjetas/platinum/foto1.png',
    active:false, progress:80
  },
  {
    id:'diamond', name:'PRESTIGE', level:'DIAMANTE', color:'diamond',
    img:'/assets/prestige/diamante.png',
    bg:'/assets/img/tarjetas/diamond/foto2.png',
    detailImg: '/assets/img/tarjetas/diamond/foto1.png',
    active:false
  }
];

  // Estado UI
  currentCardIndex = 0;     // SILVER por defecto
  currentPageIndicator = 0;
  showCardDetails = true;
  showBenefits = false;

  // Marcas
  brands: Brand[] = [
    { name: 'Ray-Ban',           logo: '/assets/img/brands/rayban.svg' },
    { name: 'Vogue',             logo: '/assets/img/brands/vogue.svg' },
    { name: 'DKNY',              logo: '/assets/img/brands/dkny.svg' },
    { name: 'D&G',               logo: '/assets/img/brands/dg.svg' },
    { name: 'Oakley',            logo: '/assets/img/brands/oakley.svg' },
    { name: 'Natura',            logo: '/assets/img/brands/natura.svg' },
    { name: "Victoria's Secret", logo: '/assets/img/brands/vs.svg' }
  ];

  constructor() {}

  ngOnInit() {
    this.setupCarousel();
  }

  setupCarousel() {
    console.log('Prestige Club carousel initialized');
  }

  // Navegación del carrusel
  previousCard() {
    if (this.currentCardIndex > 0) {
      this.cards[this.currentCardIndex].active = false;
      this.currentCardIndex--;
      this.cards[this.currentCardIndex].active = true;
      this.showBenefits = false;
      this.showCardDetails = true;
    }
  }

  nextCard() {
    if (this.currentCardIndex < this.cards.length - 1) {
      this.cards[this.currentCardIndex].active = false;
      this.currentCardIndex++;
      this.cards[this.currentCardIndex].active = true;
      this.showBenefits = false;
      this.showCardDetails = true;
    }
  }

  selectCard(index: number) {
    if (index === this.currentCardIndex) {
      // misma tarjeta -> toggle de detalle
      this.showBenefits = false;
      this.showCardDetails = !this.showCardDetails;
      return;
    }
    // nueva tarjeta
    this.cards[this.currentCardIndex].active = false;
    this.currentCardIndex = index;
    this.cards[this.currentCardIndex].active = true;
    this.showBenefits = false;
    this.showCardDetails = true;
  }

  // Dropdown de beneficios
  toggleBenefits() {
    this.showBenefits = !this.showBenefits;
  }

  // Indicadores (si los usas)
  selectPageIndicator(index: number) {
    this.currentPageIndicator = index;
    console.log(`Page indicator ${index} selected`);
  }

  // Helpers
  getCurrentCard(): PrestigeCard {
    return this.cards[this.currentCardIndex];
  }

  getPointRange(level: string): string {
    const ranges: Record<string, string> = {
      'SILVER':   '(1 a 999 puntos)',
      'GOLD':     '(1.000 a 9.999 puntos)',
      'BLACK':    '(10.000 a 69.999 puntos)',
      'PLATINUM': '(70.000 a 100.000 puntos)',
      'DIAMANTE': '(+ 100.000 puntos)'
    };
    return ranges[level] || '';
  }

  getCardDescription(level: string): string {
    const descriptions: Record<string, string> = {
      'SILVER':   'Tu camino en Club Prestige comienza aquí. La categoría Silver te da acceso a los primeros beneficios exclusivos, como descuentos en comercios asociados, Free Spins por depósito y un bono especial en tu cumpleaños. Una bienvenida a un mundo de recompensas.',
      'GOLD':     'Eleva tu experiencia con la categoría Gold. Disfruta de beneficios mejorados, acceso a promociones especiales y experiencias exclusivas diseñadas para jugadores comprometidos.',
      'BLACK':    'Ingresa al nivel premium con Black. Accede a beneficios VIP, experiencias únicas y un servicio personalizado que reconoce tu lealtad excepcional.',
      'PLATINUM': 'El prestigio alcanza nuevas alturas con Platinum. Disfruta de los máximos beneficios, eventos exclusivos y un servicio concierge dedicado.',
      'DIAMANTE': 'La máxima expresión del lujo y exclusividad. Como miembro Diamante, accedes a experiencias únicas en el mundo y beneficios sin límites.'
    };
    return descriptions[level] || '';
  }

  getCardBenefits(level: string): string[] {
    const benefits: Record<string, string[]> = {
      'SILVER': [
        'Descuentos exclusivos en comercios asociados',
        'Free Spins por depósito',
        'Bono especial de cumpleaños',
        'Acceso a promociones básicas',
        'Soporte prioritario por chat'
      ],
      'GOLD': [
        'Todos los beneficios Silver',
        'Descuentos mejorados en comercios',
        'Experiencias exclusivas mensuales',
        'Prioridad en eventos',
        'Bonos de recarga especiales'
      ],
      'BLACK': [
        'Todos los beneficios anteriores',
        'Descuentos premium',
        'Experiencias VIP',
        'Concierge personalizado',
        'Acceso a salas privadas',
        'Invitaciones a eventos exclusivos'
      ],
      'PLATINUM': [
        'Todos los beneficios anteriores',
        'Eventos exclusivos internacionales',
        'Regalos personalizados',
        'Gerente de cuenta dedicado',
        'Límites de juego elevados',
        'Retiros prioritarios'
      ],
      'DIAMANTE': [
        'Máximo nivel de privilegios',
        'Experiencias únicas mundiales',
        'Servicio 24/7 personalizado',
        'Beneficios ilimitados',
        'Acceso VIP a todos los eventos',
        'Concierge personal exclusivo'
      ]
    };
    return benefits[level] || [];
  }

  getAssociatedBrands(level: string): Brand[] {
    return this.brands;
  }

  navigateTo(section: string) {
    console.log('Ir a sección:', section);
  }

  onLogin()  { console.log('Login clicked'); }
  onRegister(){ console.log('Register clicked'); }


  onDetailImageSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Vista previa instantánea
    const url = URL.createObjectURL(file);
    this.cards[this.currentCardIndex].detailImg = url;

    // Nota: para persistir, aquí deberías subir el archivo al servidor
    // y luego guardar la URL devuelta en detailImg.
  }


}
