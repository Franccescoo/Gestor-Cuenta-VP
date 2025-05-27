import { Component, OnInit } from '@angular/core';
interface CarouselImage {
  id: number;
  url: string;
  title: string;
  description: string;
}
@Component({
  selector: 'app-carrusel',
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.scss'],
})
export class CarruselComponent  implements OnInit {
  transitioning = false;
  cartTotal: number = 0;
  cartItemCount: number = 0;
  currentIndex: number = 0;

  images: CarouselImage[] = [
    {
      id: 1,
      url: 'assets/img/fondo-3.jpg',
      title: '',
      description: ''
    },
    {
      id: 2,
      url: 'assets/img/fondo-5.jpg',
      title: '',
      description: ''
    },
    {
      id: 3,
      url: 'assets/img/fondo-1.jpg',
      title: '',
      description: ''
    },
  ];

  constructor() { }

  ngOnInit(): void {
    // Auto-advance slides every 5 seconds
    setInterval(() => {
      this.nextSlide();
    }, 8000);
    this.cartTotal = 0;
    this.cartItemCount = 0;
  }

  nextSlide(): void {
    if (this.transitioning) return;
    this.transitioning = true;

    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    setTimeout(() => (this.transitioning = false), 0); // Duración de la transición
  }

  prevSlide(): void {
    if (this.transitioning) return;
    this.transitioning = true;

    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    setTimeout(() => (this.transitioning = false), 0); // Duración de la transición
  }

  setCurrentSlide(index: number): void {
    this.currentIndex = index;
  }

}
