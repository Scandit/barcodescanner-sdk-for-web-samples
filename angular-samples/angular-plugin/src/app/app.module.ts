// tslint:disable:missing-jsdoc

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ScanditSdkModule } from "scandit-sdk-angular";
import { AppComponent } from "./app.component";

// tslint:disable-next-line:max-line-length
const licenseKey: string = "YOUR_LICENSE_KEY_IS_NEEDED_HERE";
const engineLocation: string = "https://cdn.jsdelivr.net/npm/scandit-sdk@4.x/build"; // could also be e.g. "build"

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ScanditSdkModule.forRoot(licenseKey, engineLocation)],
  bootstrap: [AppComponent],
})
// tslint:disable-next-line:no-unnecessary-class
export class AppModule {}
