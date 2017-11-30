import * as ScanditSDK from "scandit-sdk";
import { Elements } from "./elements";
import { app } from "./index";

/*
 * Functionality related to the UI of the app
 */

export const ViewFunctions = {
    setup: () => {
        window.continueScanning = ViewFunctions.continueScanning;
        window.showScanner = ViewFunctions.showScanner;
        window.showSettings = ViewFunctions.showSettings;
        window.guiStyleToggled = ViewFunctions.guiStyleToggled;
        window.cameraEnabledToggled = ViewFunctions.guiStyleToggled;
        window.cameraEnabledToggled = ViewFunctions.cameraEnabledToggled;
        window.restrictedScanningToggled = ViewFunctions.restrictedScanningToggled;
        window.setCameraButtonsEnabled = ViewFunctions.setCameraButtonsEnabled;
    },

    continueScanning: () => {
        if (app.picker) {
            Elements.continueButton.disabled = true;
            Elements.resultContainer.innerHTML = "No codes scanned yet"
            app.picker.resumeScanning();
        }
    },

    showScanner: (isContinuous = false) => {
        Elements.loadingContainer.style.display = 'none';
        Elements.mainContainer.style.display = '';
        Elements.resultContainer.innerHTML = "No codes scanned yet"
        Elements.settingsContainer.style.display = 'none';

        app.continuousScanning = isContinuous;

        app.applySettingsToScanner();
        if (app.continuousScanning) {
            ViewFunctions.setScanningUI(false);
            app.picker.resumeScanning();
        } else {
            ViewFunctions.setScanningUI(true);
        }
    },

    showSettings: () => {
        Elements.loadingContainer.style.display = 'none';
        Elements.mainContainer.style.display = 'none';
        Elements.settingsContainer.style.display = '';
        app.applySettingsToPage();
        app.picker.pauseScanning();
    },

    setScanningUI: (isPaused) => {
        Elements.continueButton.hidden = !isPaused;
        Elements.continueButton.disabled = !isPaused;
    },

    showBarcodes: (barcodes) => {
        Elements.resultContainer.innerHTML = barcodes.reduce((string, barcode) =>
        `${string}<div><span class="symbology">${ScanditSDK.Barcode.Symbology.toHumanizedName(barcode.symbology)}</span>
         ${barcode.data}</div>`,
        "");
    },

    guiStyleToggled: guiStyle => {
        Elements.guiStyle.all.forEach(toggle => {
            if (toggle.guiStyle() == guiStyle) {
                toggle.setChecked(true);
            } else {
                toggle.setChecked(false);
            }
        });
    },

    cameraEnabledToggled: cameraType => {
        const cameraTypeToDisable = cameraType === 'front' ? 'back' : 'front';
        Elements.camera[cameraType].checked = true;
        Elements.camera[cameraTypeToDisable].checked = false;

        app.setEnabledCamera(Elements.camera.activeType()).catch(e => app.handleError(e));
    },

    restrictedScanningToggled: () => {
        Elements.restrictedArea.width.disabled = !Elements.restrictedAreaToggle.checked;
        Elements.restrictedArea.height.disabled = !Elements.restrictedAreaToggle.checked;
        Elements.restrictedArea.x.disabled = !Elements.restrictedAreaToggle.checked;
        Elements.restrictedArea.y.disabled = !Elements.restrictedAreaToggle.checked;
    },

    setCameraButtonsEnabled: () => {
        ScanditSDK.CameraAccess.getCameras()
            .then(cameras => Elements.camera.all.forEach(camera => camera.disabled = cameras.length <= 1))
            .catch(app.handleError)
    },
};
