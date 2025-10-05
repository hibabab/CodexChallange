import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  user = {
    email: '',
    password: '',
  };

  isLoading = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form?: NgForm) {
    if (!form?.valid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.user).subscribe({
      next: (res) => {
        // Stockage du token dans un cookie valide 1 jour
        const expires = new Date();
        expires.setDate(expires.getDate() + 1); // cookie valable 1 jour
        document.cookie = `token=${res.accessToken};expires=${expires.toUTCString()};path=/;Secure;SameSite=Lax`;

        this.successMessage = 'Connexion réussie !';
        // redirection par exemple
        // this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || 'Erreur de connexion. Vérifiez vos identifiants.';
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
