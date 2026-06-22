import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-home',
    imports: [CommonModule, RouterLink],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  features = [
    {
      title: 'Kelime Öğrenme',
      description: 'Her gün yeni kelimeler keşfedin ve anlamlarını öğrenin.',
    },
    {
      title: 'Cümle Uygulamaları',
      description: 'Pratik cümlelerle dil bilginizi geliştirin.',
    },
    {
      title: 'Kısa Testler',
      description: 'Hafızanızı taze tutmak için hızlı testler yapın.',
    }
  ];
}
