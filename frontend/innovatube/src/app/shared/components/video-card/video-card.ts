import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Video } from '../../../core/interfaces/videos.interface';

@Component({
  selector: 'app-video-card',
  imports: [MatIconModule, DatePipe],
  templateUrl: './video-card.html',
  styleUrl: './video-card.css',
})
export class VideoCard {
  @Input({ required: true })
  video!: Video;

  @Input()
  isFavorite = false;

  @Output()
  favorite = new EventEmitter<Video>();

  toggleFavorite() {
    this.favorite.emit(this.video);
  }

  openVideo(videoId: string): void {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  }

}
