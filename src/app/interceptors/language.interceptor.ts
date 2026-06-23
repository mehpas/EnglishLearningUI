import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslationService } from '../services/translation.service';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  const translationService = inject(TranslationService);
  const language = translationService.currentLanguage();

  const request = req.clone({
    setHeaders: {
      'Accept-Language': language
    }
  });

  return next(request);
};
