import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  ProfileResponse,
} from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = 'http://localhost:3000/api/auth';
  private readonly profileStorageKey = 'profile';

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest) {
    return this.http.post(`${this.api}/register`, data);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/login`, data);
  }

  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.api}/me`).pipe(
      tap((response) => {
        if (response.data) {
          this.saveProfile(response.data);
        }
      })
    );
  }

  saveProfile(profile: ProfileResponse['data']) {
    localStorage.setItem(this.profileStorageKey, JSON.stringify(profile));
  }

  getCachedProfile(): ProfileResponse['data'] | null {
    const storedProfile = localStorage.getItem(this.profileStorageKey);

    if (!storedProfile) {
      return null;
    }

    try {
      return JSON.parse(storedProfile) as ProfileResponse['data'];
    } catch {
      return null;
    }
  }

  clearProfile() {
    localStorage.removeItem(this.profileStorageKey);
  }

  logout() {
    localStorage.removeItem('token');
    this.clearProfile();
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}
