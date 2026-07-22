import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FavoritesRequest,
  FavoritesResponse,
  ListFavoritesResponse,
} from '../interfaces/favorites.interface';
import { environment } from '../../../environments/environment';
import { Subject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private api = `${environment.apiUrl}/favorites`;
  private favoritesChanged = new Subject<void>();
  favoritesChanged$ = this.favoritesChanged.asObservable();

  constructor(private httpClient: HttpClient) {}

  addToFavorites(favorite: FavoritesRequest) {
    return this.httpClient
      .post<FavoritesResponse>(`${this.api}`, favorite)
      .pipe(tap(() => this.favoritesChanged.next()));
  }

  getFavorites() {
    return this.httpClient.get<ListFavoritesResponse>(`${this.api}`);
  }

  deleteFavorite(favoriteId: number) {
    return this.httpClient
      .delete(`${this.api}/${favoriteId}`)
      .pipe(tap(() => this.favoritesChanged.next()));
  }
}
