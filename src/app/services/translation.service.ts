import { ApplicationRef, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly fallbackLanguage = 'tr';
  private readonly storageKey = 'app-language';

  private currentLanguageValue = this.fallbackLanguage;
  private translations: TranslationDictionary = {};

  private appReady = false;

  constructor(private http: HttpClient, private appRef: ApplicationRef) {}

  async initialize(): Promise<void> {
    const initialLanguage = this.getInitialLanguage();
    await this.setLanguage(initialLanguage);
    this.appReady = true;
  }

  async setLanguage(language: string): Promise<void> {
    const normalizedLanguage = language === 'en' ? 'en' : this.fallbackLanguage;

    try {
      this.translations = await this.loadTranslations(normalizedLanguage);
      this.currentLanguageValue = normalizedLanguage;
      localStorage.setItem(this.storageKey, normalizedLanguage);
    } catch (error: unknown) {
      if (normalizedLanguage !== this.fallbackLanguage) {
        try {
          this.translations = await this.loadTranslations(this.fallbackLanguage);
        } catch {
          // Fallback also failed, keep existing translations
        }
      }

      this.currentLanguageValue = this.fallbackLanguage;
      localStorage.setItem(this.storageKey, this.fallbackLanguage);
    }

    if (this.appReady) {
      this.appRef.tick();
    }
  }

  currentLanguage(): string {
    return this.currentLanguageValue;
  }

  translate(key: string, params?: Record<string, string | number>): string {
    const template = this.resolveKey(key, this.translations);

    if (typeof template !== 'string') {
      return key;
    }

    if (!params) {
      return template;
    }

    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, token: string) => {
      const value = params[token];
      return value !== undefined ? String(value) : '';
    });
  }

  private getInitialLanguage(): string {
    const savedLanguage = localStorage.getItem(this.storageKey);
    if (savedLanguage === 'tr' || savedLanguage === 'en') {
      return savedLanguage;
    }

    const browserLanguage = navigator.language.toLowerCase();
    return browserLanguage.startsWith('en') ? 'en' : this.fallbackLanguage;
  }

  private loadTranslations(language: string): Promise<TranslationDictionary> {
    return firstValueFrom(
      this.http.get<TranslationDictionary>(`assets/i18n/${language}.json`)
    );
  }

  private resolveKey(key: string, dictionary: TranslationDictionary): string | TranslationDictionary | undefined {
    return key.split('.').reduce<string | TranslationDictionary | undefined>((current, segment) => {
      if (!current || typeof current === 'string') {
        return undefined;
      }

      return current[segment];
    }, dictionary);
  }
}
