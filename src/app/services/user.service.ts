import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENDPOINTS } from '../api.constants';
import { Observable } from 'rxjs';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface User {
  id: number;
  isim: string;
  email: string;
  kayitTarihi: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(ENDPOINTS.KULLANICILAR);
  }

  getUserById(id: number): Observable<ApiResponse<User>> {
    const url = `${ENDPOINTS.KULLANICILAR}/${id}`;
    return this.http.get<ApiResponse<User>>(url);
  }

  createUser(dto: { isim: string; email: string }): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(ENDPOINTS.KULLANICILAR, dto);
  }

  updateUser(id: number, dto: { isim: string; email: string }): Observable<ApiResponse<boolean>> {
    const url = `${ENDPOINTS.KULLANICILAR}/${id}`;
    return this.http.put<ApiResponse<boolean>>(url, dto);
  }

  deleteUser(id: number): Observable<ApiResponse<boolean>> {
    const url = `${ENDPOINTS.KULLANICILAR}/${id}`;
    return this.http.delete<ApiResponse<boolean>>(url);
  }
}
