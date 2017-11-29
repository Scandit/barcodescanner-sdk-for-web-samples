import * as ScanditSDK from "scandit-sdk";
import { ViewFunctions } from "./helpers";

/*
 * Functionality related to elements in the view
 */

export const Elements = {
    setup: () => {
        Elements.setupElementReferences();
        Elements.setupSymbologies();
        Elements.setupGuiStyles();
        Elements.setupRestrictedArea();
        Elements.setupAdvancedSettings();
        Elements.setupActiveCamera();
    },

    addSymbology: symbology => {
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
        Elements.symbologies.appendChild(template.content);
        Elements.symbology.all.push(Elements.symbology[symbology]);
    },

    addGuiStyle: guiStyle => {
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
        Elements.guiStyle.all.push(Elements.guiStyle[guiStyle])
    },

    setupElementReferences: () => {
        // Helpers to easily access elements in the view
        Elements.loadingContainer = document.getElementById("loading");
        Elements.mainContainer = document.getElementById("main");
        Elements.mainContainer.style.display = 'none';
        Elements.settingsContainer = document.getElementById("settings");
        Elements.settingsContainer.style.display = 'none';

        Elements.scannerContainer = document.getElementById("scandit-barcode-picker");
        Elements.resultContainer = document.getElementById("scandit-barcode-result");

        Elements.continueButton = document.getElementById("continue-scanning-button");
    },

    setupSymbologies: () => {
        Elements.symbologies = document.getElementById("symbologies");
        Elements.symbology = {};
        Elements.symbology.all = [];
        Elements.symbology.allEnabled = () => Elements.symbology.all.filter(symbology => symbology.checked());
        Elements.symbology.allEnabledValue = () => Elements.symbology.allEnabled().map(el => el.symbology());
        Elements.symbology.allDisabled = () => Elements.symbology.all.filter(symbology => !symbology.checked());
        Elements.symbology.allDisabledValue = () => Elements.symbology.allDisabled().map(el => el.symbology());

        // Add toggles for the symbologies dynamically and setup the convenience accessor for the symbologies toggles
        Object.keys(ScanditSDK.Barcode.Symbology).forEach(key => {
            if (typeof ScanditSDK.Barcode.Symbology[key] === 'string') {
                Elements.addSymbology(ScanditSDK.Barcode.Symbology[key]);
            }
        });
    },

    setupGuiStyles: () => {
        Elements.guiStyles = document.getElementById("gui-styles");
        Elements.guiStyle = {};
        Elements.guiStyle.all = [];

        Elements.guiStyle.values = [
            ScanditSDK.BarcodePicker.GuiStyle.NONE,
            ScanditSDK.BarcodePicker.GuiStyle.LASER,
            ScanditSDK.BarcodePicker.GuiStyle.VIEWFINDER
        ]
        Elements.guiStyle.values.forEach(guiStyle => Elements.addGuiStyle(guiStyle));

        Elements.guiStyles.active = () =>
            ScanditSDK.BarcodePicker.UIStyle[
            Elements.guiStyle.all.filter(el => el.checked())[0].guiStyle()
            ]
    },

    setupRestrictedArea: () => {
        Elements.restrictedAreaToggle = document.getElementById("restricted-scanning");
        Elements.restrictedArea = {
            width: document.getElementById("restricted-area-width"),
            height: document.getElementById("restricted-area-height"),
            x: document.getElementById("restricted-area-x"),
            y: document.getElementById("restricted-area-y"),
        };
        Elements.restrictedArea.value = () => ({
            width: parseFloat(Elements.restrictedArea.width.value, 10),
            height: parseFloat(Elements.restrictedArea.height.value, 10),
            x: parseFloat(Elements.restrictedArea.x.value, 10),
            y: parseFloat(Elements.restrictedArea.y.value, 10),
        });
        Elements.restrictedArea.isRestricted = () => Elements.restrictedAreaToggle.checked;
        Elements.restrictedArea.setArea = area => {
            Elements.restrictedArea.width.value = area.width
            Elements.restrictedArea.height.value = area.height
            Elements.restrictedArea.x.value = area.x
            Elements.restrictedArea.y.value = area.y

            const restrictedScanningEnabled = area.height !== 1 || area.width !== 1;
            Elements.restrictedAreaToggle.checked = restrictedScanningEnabled;
            // manual trigger to disabled the inputs even if the toggle did not change
            ViewFunctions.restrictedScanningToggled();
        }
    },

    setupAdvancedSettings: () => {
        Elements.beepEnabled = document.getElementById("beep-enabled")
        Elements.vibrationEnabled = document.getElementById("vibration-enabled")
        Elements.duplicateCodeFilter = document.getElementById("duplicate-code-filter")
        Elements.maxCodesPerFrame = document.getElementById("max-codes-per-frame")
        Elements.mirroringEnabled = document.getElementById("mirroring-enabled")
    },

    setupActiveCamera: () => {
        Elements.camera = {
            front: document.getElementById("camera-front"),
            back: document.getElementById("camera-back"),
            activeType: () => Elements.camera.back.checked ? ScanditSDK.Camera.Type.BACK : ScanditSDK.Camera.Type.FRONT
        }

        Elements.camera.all = [
            Elements.camera.front,
            Elements.camera.back,
        ];

        Elements.camera.setActive = cameraType => {
            Elements.camera.front.checked = cameraType === ScanditSDK.Camera.Type.FRONT
            Elements.camera.back.checked = cameraType === ScanditSDK.Camera.Type.BACK
        }
    }
};
