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

// Logo estático de AltoTermal


// Método removido - ya no se necesita



}
