import * as ScanditSDK from "scandit-sdk";
import { ViewFunctions } from "./helpers";
import { Elements } from "./elements";
import { Config } from "./config";

export class App {
    constructor() {
        this.continuousScanning = false;
        this.picker;

        this.scanSettings = new ScanditSDK.ScanSettings();
        this.scanSettings.enableSymbologies([
            ScanditSDK.Barcode.Symbology.EAN8,
            ScanditSDK.Barcode.Symbology.EAN13,
            ScanditSDK.Barcode.Symbology.UPCA,
            ScanditSDK.Barcode.Symbology.UPCE,
            ScanditSDK.Barcode.Symbology.CODE128,
            ScanditSDK.Barcode.Symbology.CODE39,
            ScanditSDK.Barcode.Symbology.CODE93
        ]);
        this.scanSettings.setCodeDuplicateFilter(1000);

        this.pickerCreateOptions = {
            visible: false,
            scanningPaused: true,
            scanSettings: this.scanSettings,
            guiStyle: ScanditSDK.BarcodePicker.GuiStyle.VIEWFINDER,
        };
    }

    handleError(error) {
        // In a real application, you'd handle errors properly, but in development, we just want to be aware if they happen
        alert(error);
    }

    start() {
        console.log('Starting up app');
        this.startScanner().then(() => {
            ViewFunctions.showSettings();
            this.applySettingsToPage();
            this.picker.pauseScanning();
        })
    }

    startScanner() {
        return ScanditSDK.configure(Config.licenseKey, {
                engineLocation: Config.engineLocation,
                preloadCameras: true,
                preloadEngineLibrary: true,
            })
            .then(() => this.createPicker(this.pickerCreateOptions))
            .catch(this.handleError);
    }

    createPicker(options) {
        if (this.picker) {
            this.picker.destroy();
        }

        return ScanditSDK.BarcodePicker.create(Elements.scannerContainer, options)
            .then(barcodePicker => {
                this.picker = barcodePicker;

                // Setup the picker callbacks
                this.picker.onScan(this.onScan);
                this.picker.onScanError(this.handleError);
                return this.picker;
            })
            .catch(this.handleError);
    }

    onScan(scanResult) {
        if (!this.continuousScanning) {
            Elements.continueButton.hidden = false;
            Elements.continueButton.disabled = false;
            this.picker.pauseScanning();
        }
        console.log(scanResult);
        Elements.resultContainer.innerHTML = scanResult.barcodes.reduce((string, barcode) =>
            `${string}<span class="symbology">${ScanditSDK.Barcode.Symbology.toHumanizedName(barcode.symbology)}</span>
             ${barcode.data}<br>`,
            "");
    }

    applySettingsToPage() {
        ViewFunctions.setCameraButtonsEnabled()

        Object.keys(Elements.symbology).forEach(symbology => {
            const element = Elements.symbology[symbology];
            const enabled = this.scanSettings.isSymbologyEnabled(symbology);
            element.setChecked(enabled);
        });

        Object.keys(Elements.guiStyle).forEach(guiStyle => {
            if (ScanditSDK.BarcodePicker.GuiStyle[guiStyle]) {
                const enabled = guiStyle === ScanditSDK.BarcodePicker.GuiStyle[this.picker.guiStyle];
                Elements.guiStyle[guiStyle].setChecked(enabled);
            }
        })

        const currentScanArea = this.scanSettings.getSearchArea();
        Elements.restrictedArea.width.value = currentScanArea.width
        Elements.restrictedArea.height.value = currentScanArea.height
        Elements.restrictedArea.x.value = currentScanArea.x
        Elements.restrictedArea.y.value = currentScanArea.y

        const restrictedScanningEnabled = currentScanArea.height !== 1 || currentScanArea.width !== 1;
        Elements.restrictedAreaToggle.checked = restrictedScanningEnabled;
        ViewFunctions.restrictedScanningToggled(); // manual trigger to disabled the inputs even if the toggle did not change

        Elements.beepEnabled.checked = this.picker.isPlaySoundOnScanEnabled();
        Elements.vibrationEnabled.checked = this.picker.isVibrateOnScanEnabled();
        Elements.duplicateCodeFilter.value = this.scanSettings.getCodeDuplicateFilter();
        Elements.maxCodesPerFrame = this.scanSettings.getMaxNumberOfCodesPerFrame();
        Elements.mirroringEnabled.checked = this.picker.isMirrorImageEnabled();

        const activeCameraType = this.picker.getActiveCamera().cameraType
        Elements.camera.front.checked = activeCameraType === ScanditSDK.Camera.Type.FRONT
        Elements.camera.back.checked = activeCameraType === ScanditSDK.Camera.Type.BACK
    }

    applySettingsToScanner() {
        // Enable symbologies that are toggled on
        Object.keys(Elements.symbology)
            .filter(symbology => Elements.symbology[symbology].checked())
            .forEach(symbology => this.scanSettings.enableSymbologies(symbology));

        // If the restricted area toggle is on, set the restricted search area where barcodes are scanned
        if (Elements.restrictedAreaToggle.checked) {
            this.scanSettings.setSearchArea({
                width: parseFloat(Elements.restrictedArea.width.value, 10),
                height: parseFloat(Elements.restrictedArea.height.value, 10),
                x: parseFloat(Elements.restrictedArea.x.value, 10),
                y: parseFloat(Elements.restrictedArea.y.value, 10),
            });
        }

        // Set the code duplicate filter
        this.scanSettings.setCodeDuplicateFilter(parseInt(Elements.duplicateCodeFilter.value, 10));
        // Set the max number of barcodes per frame that can be recognized
        this.scanSettings.setMaxNumberOfCodesPerFrame(parseInt(Elements.maxCodesPerFrame, 10));

        this.applyPickerSettings({
            cameraType: Elements.camera.activeType(),
            guiStyle: Elements.guiStyles.active(),
            soundEnabled: Elements.beepEnabled.checked,
            vibrationEnabled: Elements.vibrationEnabled.checked,
            mirroringEnabled: Elements.mirroringEnabled.checked,
            scanSettings: this.scanSettings,
        })
    }

    /**
     * Set the camera type that should be active
     *
     * @see http://docs.scandit.com/stable/web/enums/camera.type.html
     * @param {CameraType} cameraType
     * @returns {Promise<BarcodePicker>}
     */
    setEnabledCamera(cameraType) {
        return ScanditSDK.CameraAccess.getCameras()
            .then(cameras => {
                const newActiveCamera = cameras.filter(camera => camera.cameraType === cameraType)[0];
                console.log(cameras, newActiveCamera);
                return this.picker.setActiveCamera(newActiveCamera);
            });
    }

    /**
     * Apply settings to the picker
     *
     * @param {object} pickerSettings
     * @param {CameraType} pickerSettings.cameraType
     * @param {GuiStyle} pickerSettings.guiStyle
     * @param {boolean} pickerSettings.soundEnabled
     * @param {boolean} pickerSettings.vibrationEnabled
     * @param {boolean} pickerSettings.mirroringEnabled
     * @param {ScanSettings} pickerSettings.scanSettings
     * @returns {Promise<BarcodePicker>}
     */
    applyPickerSettings({
        cameraType,
        guiStyle,
        soundEnabled,
        vibrationEnabled,
        mirroringEnabled,
        scanSettings,
    }) {
        return this.setEnabledCamera(cameraType)
            .then(picker => {
                picker.setGuiStyle(guiStyle)
                picker.setPlaySoundOnScanEnabled(soundEnabled);
                picker.setVibrateOnScanEnabled(vibrationEnabled);
                picker.setMirrorImageEnabled(mirroringEnabled);
                picker.applyScanSettings(scanSettings);
                return picker;
            })
            .catch(this.handleError);
    }
}
