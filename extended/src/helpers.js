import * as ScanditSDK from "scandit-sdk";
import { Elements } from "./elements";
import { app } from "./index";

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
            Elements.continueButton.disabled = true;
            Elements.continueButton.hidden = true;
            app.picker.resumeScanning();
        } else {
            Elements.continueButton.disabled = false;
            Elements.continueButton.hidden = false;
        }
    },

    showSettings: () => {
        Elements.loadingContainer.style.display = 'none';
        Elements.mainContainer.style.display = 'none';
        Elements.settingsContainer.style.display = '';
        app.picker.pauseScanning();
    },

    guiStyleToggled: guiStyle => {
        Object.values(Elements.guiStyle).forEach(toggle => {
            if (toggle.guiStyle() == guiStyle) {
                toggle.setChecked(true);
            } else {
                toggle.setChecked(false);
            }
        });
    },

    cameraEnabledToggled: cameraType => {
        const cameraTypeToDisable = cameraType === 'front' ? 'back' : 'front';
        document.getElementById(`camera-${cameraType}`).checked = true;
        document.getElementById(`camera-${cameraTypeToDisable}`).checked = false;
    },

    restrictedScanningToggled: () => {
        Elements.restrictedArea.width.disabled = !Elements.restrictedAreaToggle.checked;
        Elements.restrictedArea.height.disabled = !Elements.restrictedAreaToggle.checked;
        Elements.restrictedArea.x.disabled = !Elements.restrictedAreaToggle.checked;
        Elements.restrictedArea.y.disabled = !Elements.restrictedAreaToggle.checked;
    },

    setCameraButtonsEnabled: () => {
        ScanditSDK.CameraAccess.getCameras()
            .then(cameras => Array.from(document.getElementsByClassName('camera-button'))
                .forEach(button => button.disabled = cameras.length <= 1))
            .catch(app.handleError)
    },
};