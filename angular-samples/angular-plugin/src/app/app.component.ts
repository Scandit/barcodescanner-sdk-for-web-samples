// tslint:disable:missing-jsdoc
import { Component } from "@angular/core";
import { Barcode, BarcodePicker, Camera, CameraAccess, CameraSettings, ScanResult, ScanSettings } from "scandit-sdk";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  public activeSettings: ScanSettings;
  public settings128: ScanSettings;
  public settings39: ScanSettings;
  public scannerGuiStyle: BarcodePicker.GuiStyle = BarcodePicker.GuiStyle.VIEWFINDER;
  public activeCamera: Camera;
  public cameraSettings: CameraSettings;
  public scanningPaused: boolean = false;
  public visible: boolean = true;
  public fps: number = 30;
  public videoFitContain: BarcodePicker.ObjectFit = BarcodePicker.ObjectFit.CONTAIN;
  public videoFitCover: BarcodePicker.ObjectFit = BarcodePicker.ObjectFit.COVER;
  public videoFit: BarcodePicker.ObjectFit = this.videoFitCover;
  public scannedCodes: Barcode[] = [];
  public isReady: boolean = false;
  public enableCameraSwitcher: boolean = true;
  public enablePinchToZoom: boolean = true;
  public enableTapToFocus: boolean = true;
  public enableTorchToggle: boolean = true;
  public enableVibrateOnScan: boolean = true;
  public cameraAccess: boolean = true;
  public enableSoundOnScan: boolean = true;

  public possibleCameras: Camera[] = [];

  constructor() {
    this.settings128 = new ScanSettings({
      enabledSymbologies: [Barcode.Symbology.CODE128]
    });
    this.settings39 = new ScanSettings({
      enabledSymbologies: [Barcode.Symbology.CODE39]
    });
    this.activeSettings = this.settings128;

    CameraAccess.getCameras().then(cameras => {
      this.possibleCameras = cameras;
    });

    this.cameraSettings = {
      resolutionPreference: CameraSettings.ResolutionPreference.FULL_HD
    };
  }

  public toggleGuiStyle(): void {
    if (this.scannerGuiStyle === BarcodePicker.GuiStyle.VIEWFINDER) {
      this.scannerGuiStyle = BarcodePicker.GuiStyle.LASER;
    } else {
      this.scannerGuiStyle = BarcodePicker.GuiStyle.VIEWFINDER;
    }
  }

  public onScan(result: ScanResult): void {
    this.scannedCodes = this.scannedCodes.concat(result.barcodes);
  }
}
