import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VideosResponse } from '../interfaces/videos.interface';

@Injectable({
  providedIn: 'root',
})
export class VideosService {
  private api = 'http://localhost:3000/api/videos';

  constructor(private http: HttpClient) {}

  searchVideos(query: string, pageToken: string = '') {
    return this.http.get<VideosResponse>(`${this.api}/search?q=${query}&pageToken=${pageToken}`);
  }

  getVideoById(videoId: string) {
    return this.http.get<VideosResponse>(`${this.api}/${videoId}`);
  }
  
}
