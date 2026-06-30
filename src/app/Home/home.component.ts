import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '../pipes/translate.pipe';
import { UserService } from '../services/user.service';
import { TranslationService } from '../services/translation.service';

@Component({
    selector: 'app-home',
    imports: [CommonModule, FormsModule, RouterLink, TranslatePipe],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  loginKullaniciId: number | null = null;
  loginSifre: string = '';
  loginHata: string = '';
  loginYukleniyor: boolean = false;
  selectedLanguage: string = this.translationService.currentLanguage();

  features = [
    {
      titleKey: 'home.features.vocabulary.title',
      descriptionKey: 'home.features.vocabulary.description',
    },
    {
      titleKey: 'home.features.sentences.title',
      descriptionKey: 'home.features.sentences.description',
    },
    {
      titleKey: 'home.features.quizzes.title',
      descriptionKey: 'home.features.quizzes.description',
    }
  ];

  constructor(
    private router: Router,
    private userService: UserService,
    private translationService: TranslationService
  ) {}

  currentLanguage(): string {
    return this.translationService.currentLanguage();
  }

  changeLanguage(language: string): void {
    this.selectedLanguage = language;
    this.translationService.setLanguage(language).catch(() => {
      // Language change failed, already handled in service
    });
  }

  goToEnglishLearning(): void {
    if (!this.loginKullaniciId || this.loginKullaniciId <= 0) {
      this.loginHata = 'messages.invalidId';
      return;
    }

    this.loginYukleniyor = true;
    this.loginHata = '';

    this.userService.getUserById(this.loginKullaniciId).subscribe({
      next: (response) => {
        this.loginYukleniyor = false;
        if (response.success && response.data) {
          if (response.data.isim === this.loginSifre) {
            this.router.navigate(['/english-learning']);
          } else {
            this.loginHata = 'messages.loginInvalidCredentials';
          }
        } else {
          this.loginHata = 'messages.loginUserNotFound';
        }
      },
      error: (err) => {
        this.loginYukleniyor = false;
        if (err.status === 404) {
          this.loginHata = 'messages.loginUserNotFound';
        } else {
          this.loginHata = 'messages.loginError';
        }
      }
    });
  }
}
