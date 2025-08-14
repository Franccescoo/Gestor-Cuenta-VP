import { Component, OnInit } from '@angular/core';


interface Brand {
  name: string;
  logo: string;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent  implements OnInit {
  currentYear: number = new Date().getFullYear();


  constructor() { }

  ngOnInit() {}

    navigateTo(section: string) {
  // TODO: reemplazar por scroll o routing real
  console.log('Ir a sección:', section);
}

brands: Brand[] = [
  { name: 'Ray-Ban', logo: '/assets/img/brands/rayban.svg' },
  { name: 'Vogue', logo: '/assets/img/brands/vogue.svg' },
  { name: 'DKNY', logo: '/assets/img/brands/dkny.svg' },
  { name: 'D&G', logo: '/assets/img/brands/dg.svg' },
  { name: 'Oakley', logo: '/assets/img/brands/oakley.svg' },
  { name: 'Natura', logo: '/assets/img/brands/natura.svg' },
  { name: "Victoria's Secret", logo: '/assets/img/brands/vvs.svg' }
];


    getAssociatedBrands(level: string): Brand[] {
    return this.brands;
  }



}
