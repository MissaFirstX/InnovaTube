import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FavoritesRequest,
  FavoritesResponse,
  ListFavoritesResponse,
} from '../interfaces/favorites.interface';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private api = `${environment.apiUrl}/favorites`;

  constructor(private httpClient: HttpClient) {}

  addToFavorites(favorite: FavoritesRequest) {
    return this.httpClient.post<FavoritesResponse>(`${this.api}`, favorite);
  }

  getFavorites() {
    return this.httpClient.get<ListFavoritesResponse>(`${this.api}`);
  }

  deleteFavorite(favoriteId: number) {
    return this.httpClient.delete(`${this.api}/${favoriteId}`);
  }
}
