import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FavoritesService } from '../../../core/services/favorites.service';
import { Favorite } from '../../../core/interfaces/favorites.interface';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-favorites',
  imports: [FormsModule, MatIconModule],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites implements OnInit, OnDestroy {
  private readonly favoritesService = inject(FavoritesService);
  private destroy$ = new Subject<void>();

  favoriteVideos = signal<Favorite[]>([]);
  search = signal('');

  filteredFavorites = computed(() => {
    const value = this.search().toLowerCase().trim();
    return this.favoriteVideos().filter(
      (video) =>
        video.title.toLowerCase().includes(value) ||
        video.channelTitle.toLowerCase().includes(value),
    );
  });

  loadFavorites(): void {
    this.favoritesService.getFavorites().subscribe({
      next: (response) => {
        this.favoriteVideos.set(response.data);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar tus favoritos.',
        });
      },
    });
  }

  async removeFavorite(favoriteId: number): Promise<void> {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar de favoritos?',
      text: 'Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
    });

    if (!result.isConfirmed) return;

    this.favoritesService.deleteFavorite(favoriteId).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el favorito.',
        });
      },
    });
  }

  ngOnInit(): void {
    this.loadFavorites();

    this.favoritesService.favoritesChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadFavorites());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
