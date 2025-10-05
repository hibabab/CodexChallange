import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';


export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' }, // redirection par défaut
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  // { path: '**', component: NotFoundComponent } // facultatif : page 404
];
