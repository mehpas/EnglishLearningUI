import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
  selector: 'app-english-learning-layout',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, TranslatePipe],
  templateUrl: './english-learning-layout.component.html',
  styleUrls: ['./english-learning-layout.component.scss']
})
export class EnglishLearningLayoutComponent {
  constructor(private router: Router) {}

  logout(): void {
    this.router.navigate(['/']);
  }
}
