import { Component, HostListener } from '@angular/core';
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
  menuOpen = false;
  readonly mobileBreakpoint = 1023;

  constructor(private router: Router) {}

  @HostListener('window:resize')
  onWindowResize(): void {
    if (!this.isMobileView()) {
      this.menuOpen = false;
    }
  }

  isMobileView(): boolean {
    return window.innerWidth <= this.mobileBreakpoint;
  }

  toggleMenu(): void {
    if (!this.isMobileView()) {
      return;
    }

    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  onNavItemClick(): void {
    if (this.isMobileView()) {
      this.closeMenu();
    }
  }

  logout(): void {
    this.onNavItemClick();
    this.router.navigate(['/']);
  }
}
