import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { languageInterceptor } from './interceptors/language.interceptor';
import { TranslationService } from './services/translation.service';

function initializeTranslations(translationService: TranslationService) {
  return () => translationService.initialize();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([languageInterceptor])),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTranslations,
      deps: [TranslationService],
      multi: true
    }
  ]
};
