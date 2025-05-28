import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {
  showPassword = false;
  password: string = '';  // <-- Agrega esta línea

  constructor(
    private router: Router
    ) { }

  ngOnInit() {
  }

  irAPagina() {
    this.router.navigate(['/menu']);
  }


  togglePassword() {
    this.showPassword = !this.showPassword;
  }


}
