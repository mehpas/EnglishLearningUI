import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Kullanici } from '../services/english-learning.service';
import { TranslatePipe } from '../pipes/translate.pipe';
import { TranslationService } from '../services/translation.service';

export interface FormData {
  isim: string;
  email: string;
}

@Component({
    selector: 'app-kullanici-form-modal',
  imports: [CommonModule, FormsModule, TranslatePipe],
    templateUrl: './kullanici-form-modal.component.html',
    styleUrls: ['./kullanici-form-modal.component.scss']
})
export class KullaniciFormModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() isEditMode = false;
  @Input() kullanici: Kullanici | null = null;
  @Input() loading = false;
  @Input() serverError: string | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<FormData>();

  formData: FormData = {
    isim: '',
    email: ''
  };

  errors: { [key: string]: string } = {};

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    if (this.isEditMode && this.kullanici) {
      this.formData = {
        isim: this.kullanici.isim,
        email: this.kullanici.email
      };
    }
  }

  onClose(): void {
    this.resetForm();
    this.close.emit();
  }

  onSubmit(): void {
    if (this.validateForm()) {
      this.submit.emit(this.formData);
    }
  }

  private validateForm(): boolean {
    this.errors = {};

    if (!this.formData.isim || !this.formData.isim.trim()) {
      this.errors['isim'] = this.t('validation.nameRequired');
    } else if (this.formData.isim.length > 100) {
      this.errors['isim'] = this.t('validation.nameMaxLength');
    }

    if (!this.formData.email || !this.formData.email.trim()) {
      this.errors['email'] = this.t('validation.emailRequired');
    } else if (!this.isValidEmail(this.formData.email)) {
      this.errors['email'] = this.t('validation.invalidEmail');
    } else if (this.formData.email.length > 150) {
      this.errors['email'] = this.t('validation.emailMaxLength');
    }

    return Object.keys(this.errors).length === 0;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private resetForm(): void {
    this.formData = {
      isim: '',
      email: ''
    };
    this.errors = {};
  }

  private t(key: string): string {
    return this.translationService.translate(key);
  }
}
