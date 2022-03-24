import { Component, ViewChild, ElementRef } from "@angular/core";
import * as ScanditSDK from "scandit-sdk";
import { BarcodePicker, ScanResult } from "scandit-sdk";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  public scannerReady = false;
  public showButton = false;
  public showDescription = true;
  public result = "";

  @ViewChild("barcodePicker") barcodePickerElement: ElementRef<HTMLDivElement & { barcodePicker: BarcodePicker }>;

  public onReady(): void {
    this.scannerReady = true;
    this.showButton = true;
  }

  public onScan(scanResult: { detail: ScanResult }): void {
    const calculatedString = scanResult.detail.barcodes.reduce((result, barcode) => {
      return `${result} ${ScanditSDK.Barcode.Symbology.toHumanizedName(barcode.symbology)} : ${barcode.data}`;
    }, "");

    this.result = calculatedString;
  }

  public startBarcodePicker(): void {
    this.showButton = false;
    this.showDescription = false;

    this.barcodePickerElement.nativeElement.barcodePicker.setVisible(true).resumeScanning();
  }
}
