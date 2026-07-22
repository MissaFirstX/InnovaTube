import { Component, inject, OnInit } from '@angular/core';
import { Video } from '../../../core/interfaces/videos.interface';
import { VideosService } from '../../../core/services/videos.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { VideoCard } from '../../../shared/components/video-card/video-card';
import { FavoritesService } from '../../../core/services/favorites.service';
import { FavoritesRequest } from '../../../core/interfaces/favorites.interface';

@Component({
  selector: 'app-videos',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, VideoCard],
  templateUrl: './videos.html',
  styleUrl: './videos.css',
})
export class Videos{
  private readonly videoService = inject(VideosService);
  private readonly favoritesService = inject(FavoritesService);

  videos: Video[] = [];


  searchVideos(searchTerm: string): void {
    const query = searchTerm.trim();

    if (!query) return;

    this.videoService.searchVideos(query).subscribe({
      next: ({ data }) => {
        this.videos = data.videos;
      },
      error: console.error,
    });
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
        console.log('Favorito agregado');
      },
      error: console.error,
    });
  }
}


