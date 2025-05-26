import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbDialogModule, NbThemeModule } from '@nebular/theme';
import { GALLERY_CONFIG, GalleryConfig } from 'ng-gallery';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(NbThemeModule.forRoot(), NbEvaIconsModule, NbDialogModule.forRoot()),
    provideAnimations(),
    {
      provide: GALLERY_CONFIG,
      useValue: {
        autoHeight: true,
        imageSize: 'cover',
      } as GalleryConfig,
    },
  ],
};

export const environment = {
  supabaseUrl: import.meta.env.NG_APP_SUPABASE_URL,
  supabaseKey: import.meta.env.NG_APP_SUPABASE_KEY,
  subabaseBucketName: import.meta.env.NG_APP_SUPABSE_BUCKET_NAME,
  subabaseTableName: import.meta.env.NG_APP_SUPABSE_TABLE_NAME,
};
