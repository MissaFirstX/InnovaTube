import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css', '../../../shared/styles/auth-shared.css'],
})
export class Login {
  
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isSubmitting = false;
  errorMessage: string | null = null;

  onSubmit(): void {
    const username = this.loginForm.value.username?.trim() || '';

    if (!username) {
      this.loginForm.get('username')?.markAsTouched();
      this.errorMessage = 'Debes ingresar un usuario.';
      return;
    }

    if (this.loginForm.get('password')?.invalid) {
      this.loginForm.get('password')?.markAsTouched();
      this.errorMessage = 'La contraseña es obligatoria.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const payload = {
      username,
      password: this.loginForm.value.password,
    };

    this.authService.login(payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        const token = response?.data?.token;

        if (token) {
          localStorage.setItem('token', token);
        }

        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage =
          error?.error?.message || 'No se pudo iniciar sesión. Inténtalo de nuevo.';
      },
    });
  }
}
