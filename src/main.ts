import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { enableRipple } from '@syncfusion/ej2-base';

if (environment.production) {
  enableProdMode();
}

enableRipple(true);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
