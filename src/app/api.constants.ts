import { environment } from '../environments/environment';

export const API_BASE = environment.apiUrl;

export const ENDPOINTS = {
  KULLANICILAR: API_BASE + '/Kullanicilar'
};
