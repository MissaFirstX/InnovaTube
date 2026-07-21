import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  register(payload: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  }): Observable<{ message?: string }> {
    return this.http.post<{ message?: string }>('http://localhost:3000/api/auth/register', payload);
  }

  login(payload: {
    username: string;
    password: string;
  }): Observable<{ data?: { token?: string } }> {
    return this.http.post<{ data?: { token?: string } }>(
      'http://localhost:3000/api/auth/login',
      payload,
    );
  }
}
