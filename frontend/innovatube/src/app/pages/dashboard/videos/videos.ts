import { Component, inject, OnInit, signal } from '@angular/core';
import { Video } from '../../../core/interfaces/videos.interface';
import { VideosService } from '../../../core/services/videos.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { VideoCard } from '../../../shared/components/video-card/video-card';
import { FavoritesService } from '../../../core/services/favorites.service';
import { FavoritesRequest } from '../../../core/interfaces/favorites.interface';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-videos',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, VideoCard],
  templateUrl: './videos.html',
  styleUrl: './videos.css',
})
export class Videos {
  private readonly videoService = inject(VideosService);
  private readonly favoritesService = inject(FavoritesService);

  searchTerm = signal('');
  videos = signal<Video[]>([]);

  searchVideos(): void {
    const query = this.searchTerm().trim();
    if (!query) return;

    this.videoService.searchVideos(query).subscribe({
      next: ({ data }) => this.videos.set(data.videos),
      error: () => {
        /* ... */
      },
    });
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.videos.set([]);
  }

  addFavorite(video: Video) {
    const favorite: FavoritesRequest = {
      videoId: video.id,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      channelTitle: video.channelTitle,
      publishedAt: video.publishedAt,
    };

    this.favoritesService.addToFavorites(favorite).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Agregado a favoritos',
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
          text: 'No se pudo agregar a favoritos.',
        });
      },
    });
  }
}
