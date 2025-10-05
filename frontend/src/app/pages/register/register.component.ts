import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink], // Ajout de RouterLink
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  user = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: '',
  };

  confirmPassword: string = ''; // Correction du type
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    // Marquer tous les champs comme touchés pour afficher les erreurs
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });

    // Vérifier si le formulaire est valide
    if (form.invalid) {
      this.errorMessage = "Veuillez corriger les erreurs dans le formulaire.";
      return;
    }

    // Vérifier la correspondance des mots de passe
    if (this.user.password !== this.confirmPassword) {
      this.errorMessage = "Les mots de passe ne correspondent pas.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.user).subscribe({
      next: () => {
        this.successMessage = "Inscription réussie ! Redirection...";
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Une erreur est survenue lors de l\'inscription.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  // Méthode pour vérifier si les mots de passe correspondent
  passwordsMatch(): boolean {
    return this.user.password === this.confirmPassword;
  }

  
}