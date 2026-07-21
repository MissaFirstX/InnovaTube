import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, NgZone, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css', '../../../shared/styles/auth-shared.css'],
})
export class Register implements AfterViewInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  @ViewChild('recaptchaContainer', { static: false }) recaptchaContainer?: ElementRef;

  private recaptchaWidgetId: number | null = null;
  private recaptchaToken: string | null = null;
  recaptchaReady = false;
  recaptchaErrorMessage: string | null = null;
  hasRecaptchaWidget = false;

  registerForm: FormGroup = this.fb.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordsMatchValidator },
  );

  isSubmitting = false;
  message: string | null = null;
  errorMessage: string | null = null;

  ngAfterViewInit(): void {
    this.loadRecaptcha();
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    if (!this.recaptchaToken) {
      this.errorMessage = 'Confirma el reCAPTCHA para continuar.';
      return;
    }

    this.isSubmitting = true;
    this.message = null;
    this.errorMessage = null;

    const { confirmPassword, ...payload } = this.registerForm.value;

    this.authService.register(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.message = 'Registro creado correctamente. Redirigiendo al inicio de sesión...';
        this.registerForm.reset();
        this.resetRecaptcha();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage =
          error?.error?.message || 'No se pudo completar el registro. Inténtalo de nuevo.';
      },
    });
  }

  private loadRecaptcha(): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (this.recaptchaWidgetId !== null) {
      return;
    }

    const initialize = () => {
      if (!this.recaptchaContainer?.nativeElement) {
        return;
      }

      this.ngZone.run(() => {
        this.recaptchaReady = false;
        this.hasRecaptchaWidget = false;
        this.recaptchaErrorMessage = null;
      });

      window.grecaptcha.ready(() => this.renderRecaptcha());
    };

    if (window.grecaptcha?.render) {
      initialize();
      return;
    }

    const existingScript = document.getElementById('recaptcha-script');
    if (existingScript) {
      existingScript.addEventListener(
        'load',
        () => {
          initialize();
        },
        { once: true },
      );
      return;
    }

    const script = document.createElement('script');
    script.id = 'recaptcha-script';
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initialize();
    };
    script.onerror = () => {
      this.ngZone.run(() => {
        this.recaptchaReady = false;
        this.hasRecaptchaWidget = false;
        this.recaptchaErrorMessage = 'No se pudo cargar el script de Google reCAPTCHA.';
      });
    };
    document.head.appendChild(script);
  }

  private renderRecaptcha(): void {
    if (!this.recaptchaContainer?.nativeElement) {
      return;
    }

    try {
      if (typeof window.grecaptcha?.render !== 'function') {
        this.ngZone.run(() => {
          this.recaptchaReady = false;
          this.hasRecaptchaWidget = false;
          this.recaptchaErrorMessage =
            'No se pudo cargar el widget de Google. Revisa la conexión o la clave de reCAPTCHA.';
        });
        return;
      }

      if (this.recaptchaWidgetId !== null) {
        window.grecaptcha.reset(this.recaptchaWidgetId);
      }

      this.recaptchaContainer.nativeElement.innerHTML = '';
      this.recaptchaWidgetId = window.grecaptcha.render(this.recaptchaContainer.nativeElement, {
        sitekey: '6Leckl4tAAAAAI-RUEZ-cp_-pAHklCcMoVserkDl',
        callback: (token: string) => {
          this.ngZone.run(() => {
            this.recaptchaToken = token;
          });
        },
        'expired-callback': () => {
          this.ngZone.run(() => {
            this.recaptchaToken = null;
          });
        },
        theme: 'light',
      });

      this.ngZone.run(() => {
        this.recaptchaReady = true;
        this.hasRecaptchaWidget = true;
        this.recaptchaErrorMessage = null;
      });
    } catch (error) {
      this.ngZone.run(() => {
        this.recaptchaReady = false;
        this.hasRecaptchaWidget = false;
        this.recaptchaErrorMessage = 'El widget de reCAPTCHA no pudo inicializarse.';
      });
      console.error(error);
    }
  }

  private resetRecaptcha(): void {
    if (this.recaptchaWidgetId !== null && typeof window.grecaptcha?.reset === 'function') {
      window.grecaptcha.reset(this.recaptchaWidgetId);
    }
    this.recaptchaToken = null;
  }


  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }
}
