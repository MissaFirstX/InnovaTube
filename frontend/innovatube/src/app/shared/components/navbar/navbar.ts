import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../core/services/auth.service';
import { ProfileResponse } from '../../../core/interfaces/auth.interface';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  profile = signal<ProfileResponse['data'] | undefined>(undefined);

  ngOnInit(): void {
    this.profile.set(this.authService.getCachedProfile() ?? undefined);

    this.authService.getProfile().subscribe({
      next: (response) => {
        if (response.data) {
          this.profile.set(response.data);
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar el perfil',
          text: 'No pudimos obtener tus datos, intenta recargar la página.',
        });
      },
    });
  }

  async logout() {
    const result = await Swal.fire({
      icon: 'question',
      title: '¿Cerrar sesión?',
      text: 'Tendrás que volver a iniciar sesión para continuar.',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToFavorites(): void {
    document.getElementById('favorites')?.scrollIntoView({ behavior: 'smooth' });
  }
}
