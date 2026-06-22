import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENDPOINTS } from '../api.constants';
import { Observable } from 'rxjs';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Kullanici {
  id: number;
  isim: string;
  email: string;
  kayitTarihi: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnglishLearningService {
  constructor(private http: HttpClient) {}

  getKullanicilar(): Observable<ApiResponse<Kullanici[]>> {
    return this.http.get<ApiResponse<Kullanici[]>>(ENDPOINTS.KULLANICILAR);
  }

  getKullaniciById(id: number): Observable<ApiResponse<Kullanici>> {
    const url = `${ENDPOINTS.KULLANICILAR}/${id}`;
    return this.http.get<ApiResponse<Kullanici>>(url);
  }
}
