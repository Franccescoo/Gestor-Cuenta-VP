import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { validarSesionRolGuard } from './Guard/validar-sesion-rol.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'index',
    loadChildren: () => import('./index/index.module').then( m => m.IndexPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule),
    canActivate: [validarSesionRolGuard],
    data: { issuer: 'AUTH-backend' }
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule),
    canActivate: [validarSesionRolGuard],
    data: { issuer: 'AUTH-backend' }
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/LandingPage/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'contacto',
    loadChildren: () => import('./pages/LandingPage/contacto/contacto.module').then( m => m.ContactoPageModule)
  },
  {
    path: 'iniciar-sesion',
    loadChildren: () => import('./pages/LandingPage/iniciar-sesion/iniciar-sesion.module').then( m => m.IniciarSesionPageModule)
  },
  {
    path: 'prestige-club',
    loadChildren: () => import('./pages/LandingPage/prestige-club/prestige-club.module').then( m => m.PrestigeClubPageModule)
  },
  {
    path: 'como-ser',
    loadChildren: () => import('./pages/LandingPage/como-ser/como-ser.module').then( m => m.ComoSerPageModule)
  },
  {
    path: 'olvidar-pass',
    loadChildren: () => import('./pages/LandingPage/olvidar-pass/olvidar-pass.module').then( m => m.OlvidarPassPageModule)
  },
  {
    path: 'registrar',
    loadChildren: () => import('./pages/LandingPage/registrar/registrar.module').then( m => m.RegistrarPageModule)
  },
  {
    path: 'beneficios',
    loadChildren: () => import('./pages/beneficios/beneficios.module').then( m => m.BeneficiosPageModule),
    canActivate: [validarSesionRolGuard],
    data: { issuer: 'AUTH-backend' }
  },
  {
    path: 'canjear-puntos',
    loadChildren: () => import('./pages/canjear-puntos/canjear-puntos.module').then( m => m.CanjearPuntosPageModule),
    canActivate: [validarSesionRolGuard],
    data: { issuer: 'AUTH-backend' }
  },
  {
    path: 'info-usuario',
    loadChildren: () => import('./pages/info-usuario/info-usuario.module').then( m => m.InfoUsuarioPageModule)
  },





];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
