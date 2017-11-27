const Elements = {}

// View functions
const continueScanning = () => {
    if (picker) {
        Elements.continueButton.disabled = true;
        Elements.resultContainer.innerHTML = "No codes scanned yet"
        picker.resumeScanning();
    }
};

const showScanner = (isContinuous = false) => {
    Elements.loadingContainer.style.display = 'none';
    Elements.mainContainer.style.display = '';
    Elements.resultContainer.innerHTML = "No codes scanned yet"
    Elements.settingsContainer.style.display = 'none';

    continuousScanning = isContinuous;

    app.applySettingsToScanner();
    if (continuousScanning) {
        Elements.continueButton.disabled = true;
        Elements.continueButton.hidden = true;
        picker.resumeScanning();
    } else {
        Elements.continueButton.disabled = false;
        Elements.continueButton.hidden = false;
    }
}

const showSettings = () => {
    Elements.loadingContainer.style.display = 'none';
    Elements.mainContainer.style.display = 'none';
    Elements.settingsContainer.style.display = '';

    app.applySettingsToPage();
    picker.pauseScanning();
}

const guiStyleToggled = guiStyle => {
    Object.values(Elements.guiStyle).forEach(toggle => {
        if (toggle.guiStyle() == guiStyle) {
            toggle.setChecked(true);
        } else {
            toggle.setChecked(false);
        }
    });
}

const cameraEnabledToggled = cameraType => {
    const cameraTypeToDisable = cameraType === 'front' ? 'back' : 'front';
    document.getElementById(`camera-${cameraType}`).checked = true;
    document.getElementById(`camera-${cameraTypeToDisable}`).checked = false;
}

const restrictedScanningToggled = () => {
    Elements.restrictedArea.width.disabled = !Elements.restrictedAreaToggle.checked;
    Elements.restrictedArea.height.disabled = !Elements.restrictedAreaToggle.checked;
    Elements.restrictedArea.x.disabled = !Elements.restrictedAreaToggle.checked;
    Elements.restrictedArea.y.disabled = !Elements.restrictedAreaToggle.checked;
}

const setCameraButtonsEnabled = () => {
    ScanditSDK.CameraAccess.getCameras()
        .then(cameras => Array.from(document.getElementsByClassName('camera-button'))
            .forEach(button => button.disabled = cameras.length <= 1))
        .catch(handleError)
}

// Page Setup

const setupElements = () => {
    const setupSymbology = symbology => {
        const humanizedName = ScanditSDK.Barcode.Symbology.toHumanizedName(symbology);
        var template = document.createElement('template');
        template.innerHTML = `<div class="symbology">
                                  <label class="toggle">
                                      <input type="checkbox" name="${humanizedName} Toggle"
                                          id="symbology-${symbology}">
                                      <span class="slider"></span>
                                  </label>
                                  <span>${humanizedName}</span>
                              </div>`;
        // Add the reference to the view element to the convenience accessor
        Elements.symbology[symbology] = template.content.firstElementChild;
        const checkbox = Elements.symbology[symbology].firstElementChild.firstElementChild;
        // Add some functions to make it easier to access information about the symbology setting in the view
        Elements.symbology[symbology].checked = () => checkbox.checked;
        Elements.symbology[symbology].setChecked = (isChecked) => {
            checkbox.checked = isChecked;
        };
        Elements.symbology[symbology].symbology = () => checkbox.id.replace('symbology-', '');
        // Add the symbology element to the view
        Elements.symbologies.appendChild(template.content)
    };

    const setupGuiStyle = guiStyle => {
        if (typeof guiStyle != 'string') {
            guiStyle = ScanditSDK.BarcodePicker.GuiStyle[guiStyle]; // we need the string representation of the GUI style
        }
        var template = document.createElement('template');
        template.innerHTML = `<div class="gui-style segment-item">
                                  <input type="checkbox" name="${guiStyle} GUI Style Toggle"
                                      id="gui-style-${guiStyle}" onchange="guiStyleToggled('${guiStyle}')">
                                  <div class="segment-item-inner">
                                      <span>${guiStyle}</span>
                                  </div>
                              </div>`;
        // Add the reference to the view element to the convenience accessor
        Elements.guiStyle[guiStyle] = template.content.firstElementChild;
        const checkbox = Elements.guiStyle[guiStyle].firstElementChild;
        // Add some functions to make it easier to access information about the guiStyle setting in the view
        Elements.guiStyle[guiStyle].checked = () => checkbox.checked;
        Elements.guiStyle[guiStyle].setChecked = (isChecked) => {
            checkbox.checked = isChecked;
        };
        Elements.guiStyle[guiStyle].guiStyle = () => checkbox.id.replace('gui-style-', '');
        // Add the guiStyle element to the view
        Elements.guiStyles.appendChild(template.content)
    }

    // Helpers to easily access elements in the view
    Elements.loadingContainer = document.getElementById("loading");
    Elements.mainContainer = document.getElementById("main");
    Elements.mainContainer.style.display = 'none';
    Elements.settingsContainer = document.getElementById("settings");
    Elements.settingsContainer.style.display = 'none';

    Elements.scannerContainer = document.getElementById("scandit-barcode-picker");
    Elements.resultContainer = document.getElementById("scandit-barcode-result");

    Elements.continueButton = document.getElementById("continue-scanning-button");

    Elements.symbologies = document.getElementById("symbologies");
    Elements.symbology = {};

    // Add toggles for the symbologies dynamically and setup the convenience accessor for the symbologies toggles
    Object.keys(ScanditSDK.Barcode.Symbology).forEach(key => {
        if (typeof ScanditSDK.Barcode.Symbology[key] === 'string') {
            setupSymbology(ScanditSDK.Barcode.Symbology[key]);
        }
    });

    Elements.guiStyles = document.getElementById("gui-styles");
    Elements.guiStyle = {};

    const guiStyles = [
        ScanditSDK.BarcodePicker.GuiStyle.NONE,
        ScanditSDK.BarcodePicker.GuiStyle.LASER,
        ScanditSDK.BarcodePicker.GuiStyle.VIEWFINDER
    ]
    guiStyles.forEach(guiStyle => setupGuiStyle(guiStyle));

    Elements.guiStyles.active = () =>
        ScanditSDK.BarcodePicker.UIStyle[
        Object.keys(Elements.guiStyle)
            .filter(s => ScanditSDK.BarcodePicker.UIStyle[s] !== undefined)
            .filter(style => Elements.guiStyle[style].checked())[0]]

    Elements.restrictedAreaToggle = document.getElementById("restricted-scanning");
    Elements.restrictedArea = {
        width: document.getElementById("restricted-area-width"),
        height: document.getElementById("restricted-area-height"),
        x: document.getElementById("restricted-area-x"),
        y: document.getElementById("restricted-area-y"),
    };

    Elements.beepEnabled = document.getElementById("beep-enabled")
    Elements.vibrationEnabled = document.getElementById("vibration-enabled")
    Elements.duplicateCodeFilter = document.getElementById("duplicate-code-filter")
    Elements.maxCodesPerFrame = document.getElementById("max-codes-per-frame")
    Elements.mirroringEnabled = document.getElementById("mirroring-enabled")

    Elements.camera = {
        front: document.getElementById("camera-front"),
        back: document.getElementById("camera-back"),
        activeType: () => Elements.camera.back.checked ? ScanditSDK.Camera.Type.BACK : ScanditSDK.Camera.Type.FRONT
    }
}