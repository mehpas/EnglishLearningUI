import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from './pipes/translate.pipe';
import { TranslationService } from './services/translation.service';

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet, TranslatePipe],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'EnglishLearningUI';

  constructor(private translationService: TranslationService) {}

  currentLanguage(): string {
    return this.translationService.currentLanguage();
  }

  changeLanguage(language: string): void {
    void this.translationService.setLanguage(language);
  }
}
