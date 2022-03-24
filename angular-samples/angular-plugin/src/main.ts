// tslint:disable:missing-jsdoc
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  // tslint:disable-next-line:ter-arrow-body-style
  .catch(err => console.log(err));
