import BarcodePickerWrapper from './BarcodePickerWrapper';
import { Barcode, BarcodePicker, ScanSettings } from 'scandit-sdk';
import { useState } from 'react';

const features = {
    visible: true,
    playSoundOnScan: true,
    vibrateOnScan: false,
    scanningPaused: false,
    guiStyle: BarcodePicker.GuiStyle.LASER,
    enableCameraSwitcher: true,
    enableTorchToggle: true,
    enableTapToFocus: true,
    enablePinchToZoom: true,
    accessCamera: true
}

const enabledSymbologies = [
    Barcode.Symbology.QR,
    Barcode.Symbology.EAN8,
    Barcode.Symbology.EAN13,
    Barcode.Symbology.UPCA,
    Barcode.Symbology.UPCE,
    Barcode.Symbology.CODE128,
    Barcode.Symbology.CODE39,
    Barcode.Symbology.CODE93,
    Barcode.Symbology.GS1_DATABAR];

function App() {
    const [result, setResult] = useState('');

    return (
        <div className="App">
            <div id="scandit-barcode-result" className="result-text">{result}</div>

            <BarcodePickerWrapper
                {...features}
                scanSettings={
                    new ScanSettings({
                        enabledSymbologies,
                        codeDuplicateFilter: 1000
                    })
                }

                onScan={(scanResult) => {
                    const result = scanResult.barcodes.reduce((string, barcode) => {
                        return string + Barcode.Symbology.toHumanizedName(barcode.symbology) + ": " + barcode.data;
                    }, '');

                    setResult(result);
                }}

                onError={(error) => {
                    console.error(error.message);
                }}
            />
        </div>
    );
}

export default App;