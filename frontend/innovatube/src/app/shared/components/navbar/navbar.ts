import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../core/services/auth.service';
import { ProfileResponse } from '../../../core/interfaces/auth.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  profile?: ProfileResponse['data'];

  ngOnInit(): void {
    this.profile = this.authService.getCachedProfile() ?? undefined;

    this.authService.getProfile().subscribe({
      next: (response) => {
        if (response.data) {
          this.profile = response.data;
        }
      },
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToFavorites(): void {
    document.getElementById('favorites')?.scrollIntoView({ behavior: 'smooth' });
  }
}
