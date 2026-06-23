import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
    selector: 'app-home',
    imports: [CommonModule, RouterLink, TranslatePipe],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
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
}
