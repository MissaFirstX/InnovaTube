import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FavoritesService } from '../../../core/services/favorites.service';
import { Favorite } from '../../../core/interfaces/favorites.interface';

@Component({
  selector: 'app-favorites',
  imports: [FormsModule, MatIconModule],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites implements OnInit {
  private readonly favoritesService = inject(FavoritesService);

  favoriteVideos: Favorite[] = [];
  filteredFavorites: Favorite[] = [];

  search = '';

  loadFavorites(): void {
    this.favoritesService.getFavorites().subscribe({
      next: (response) => {
        this.favoriteVideos = response.data;
        this.filteredFavorites = [...this.favoriteVideos];
      },
    });
  }

  filterFavorites(): void {
    const value = this.search.toLowerCase().trim();

    this.filteredFavorites = this.favoriteVideos.filter(
      (video) =>
        video.title.toLowerCase().includes(value) ||
        video.channelTitle.toLowerCase().includes(value),
    );
  }

  removeFavorite(favoriteId: number): void {
    this.favoritesService.deleteFavorite(favoriteId).subscribe({
      next: () => {
        this.favoriteVideos = this.favoriteVideos.filter((f) => f.id !== favoriteId);

        this.filterFavorites();
        this.loadFavorites();
      },
    });
  }

  ngOnInit(): void {
    this.loadFavorites();
  }
}
