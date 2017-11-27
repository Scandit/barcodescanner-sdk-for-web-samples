// Global variables
const Constants = {
    licenseKey: "-- ENTER YOUR SCANDIT LICENSE KEY HERE --",
    engineLocation: "https://unpkg.com/scandit-sdk/build", // could also be e.g. "build"
}

let picker;
let scanSettings = new ScanditSDK.ScanSettings();
let pickerCreateOptions = {
    visible: false,
    scanningPaused: true,
    scanSettings: scanSettings,
    guiStyle: ScanditSDK.BarcodePicker.GuiStyle.VIEWFINDER,
};
let continuousScanning = false;

// Helpers

const setupDefaultScanSettings = () => {
    // Setup the scanner settings
    scanSettings.enableSymbologies([
        ScanditSDK.Barcode.Symbology.EAN8,
        ScanditSDK.Barcode.Symbology.EAN13,
        ScanditSDK.Barcode.Symbology.UPCA,
        ScanditSDK.Barcode.Symbology.UPCE,
        ScanditSDK.Barcode.Symbology.CODE128,
        ScanditSDK.Barcode.Symbology.CODE39,
        ScanditSDK.Barcode.Symbology.CODE93
    ]);
    scanSettings.setCodeDuplicateFilter(1000);
    return scanSettings;
}

// Handlers

const onScan = scanResult => {
    if (!continuousScanning) {
        Elements.continueButton.hidden = false;
        Elements.continueButton.disabled = false;
        picker.pauseScanning();
    }
    console.log(scanResult);
    Elements.resultContainer.innerHTML = scanResult.barcodes.reduce((string, barcode) =>
        `${string}<span class="symbology">${ScanditSDK.Barcode.Symbology.toHumanizedName(barcode.symbology)}</span>
         ${barcode.data}<br>`,
        "");
}

// In a real application, you'd handle errors properly, but in development, we just want to be aware if they happen
const handleError = error => {
    alert(error);
}

class App {
    constructor() {
        setupDefaultScanSettings();
    }

    start() {
        console.log('Starting up app');
        this.startScanner().then(() => {
            showSettings();
            this.applySettingsToPage();
        })
    }

    startScanner() {
        // Configure the library with a license key and set the location of the engine
        // See http://docs.scandit.com/stable/web/globals.html#configure
        return ScanditSDK.configure(Constants.licenseKey, {
                engineLocation: Constants.engineLocation,
                preloadCameras: true,
                preloadEngineLibrary: true,
            })
            .then(() => this.createPicker(pickerCreateOptions))
            .catch(handleError);
    }

    createPicker(options) {
        if (picker) {
            picker.destroy();
        }

        return ScanditSDK.BarcodePicker.create(Elements.scannerContainer, options)
            .then(barcodePicker => {
                picker = barcodePicker;

                // Setup the picker callbacks
                picker.onScan(onScan);
                picker.onScanError(handleError);
                return picker;
            })
            .catch(handleError);
    }

    applySettingsToPage() {
        setCameraButtonsEnabled()

        Object.keys(Elements.symbology).forEach(symbology => {
            const element = Elements.symbology[symbology];
            const enabled = scanSettings.isSymbologyEnabled(symbology);
            element.setChecked(enabled);
        });

        Object.keys(Elements.guiStyle).forEach(guiStyle => {
            if (ScanditSDK.BarcodePicker.GuiStyle[guiStyle]) {
                const enabled = guiStyle === ScanditSDK.BarcodePicker.GuiStyle[picker.guiStyle];
                Elements.guiStyle[guiStyle].setChecked(enabled);
            }
        })

        const currentScanArea = scanSettings.getSearchArea();
        Elements.restrictedArea.width.value = currentScanArea.width
        Elements.restrictedArea.height.value = currentScanArea.height
        Elements.restrictedArea.x.value = currentScanArea.x
        Elements.restrictedArea.y.value = currentScanArea.y

        const restrictedScanningEnabled = currentScanArea.height !== 1 || currentScanArea.width !== 1;
        Elements.restrictedAreaToggle.checked = restrictedScanningEnabled;
        restrictedScanningToggled(); // manual trigger to disabled the inputs even if the toggle did not change

        Elements.beepEnabled.checked = picker.isPlaySoundOnScanEnabled();
        Elements.vibrationEnabled.checked = picker.isVibrateOnScanEnabled();
        Elements.duplicateCodeFilter.value = scanSettings.getCodeDuplicateFilter();
        Elements.maxCodesPerFrame = scanSettings.getMaxNumberOfCodesPerFrame();
        Elements.mirroringEnabled.checked = picker.isMirrorImageEnabled();

        const activeCameraType = picker.getActiveCamera().cameraType
        Elements.camera.front.checked = activeCameraType === ScanditSDK.Camera.Type.FRONT
        Elements.camera.back.checked = activeCameraType === ScanditSDK.Camera.Type.BACK
    }

    applySettingsToScanner() {
        // Enable symbologies that are toggled on
        Object.keys(Elements.symbology)
            .filter(symbology => Elements.symbology[symbology].checked())
            .forEach(symbology => scanSettings.enableSymbologies(symbology));

        // If the restricted area toggle is on, set the restricted search area where barcodes are scanned
        if (Elements.restrictedAreaToggle.checked) {
            scanSettings.setSearchArea({
                width: parseFloat(Elements.restrictedArea.width.value, 10),
                height: parseFloat(Elements.restrictedArea.height.value, 10),
                x: parseFloat(Elements.restrictedArea.x.value, 10),
                y: parseFloat(Elements.restrictedArea.y.value, 10),
            });
        }

        // Set the code duplicate filter
        scanSettings.setCodeDuplicateFilter(parseInt(Elements.duplicateCodeFilter.value, 10));
        // Set the max number of barcodes per frame that can be recognized
        scanSettings.setMaxNumberOfCodesPerFrame(parseInt(Elements.maxCodesPerFrame, 10));

        this.applyPickerSettings({
            cameraType: Elements.camera.activeType(),
            guiStyle: Elements.guiStyles.active(),
            soundEnabled: Elements.beepEnabled.checked,
            vibrationEnabled: Elements.vibrationEnabled.checked,
            mirroringEnabled: Elements.mirroringEnabled.checked,
            scanSettings: scanSettings,
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
                return picker.setActiveCamera(newActiveCamera);
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
            .catch(handleError);
    }
}

let app;

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        setupElements();
        app = new App();
        app.start();
    }
}