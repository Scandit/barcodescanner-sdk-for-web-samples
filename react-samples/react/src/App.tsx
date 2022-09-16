import BarcodePicker from './BarcodePicker';
import { Barcode, ScanSettings } from 'scandit-sdk';

function App() {
    return (
        <div className="App">
            {/* <div id="scandit-barcode-result" className="result-text"></div> */}

            <BarcodePicker
                playSoundOnScan={true}
                vibrateOnScan={true}
                scanSettings={
                    new ScanSettings({
                        enabledSymbologies: [Barcode.Symbology.QR, Barcode.Symbology.EAN8, Barcode.Symbology.EAN13, Barcode.Symbology.UPCA, Barcode.Symbology.UPCE, Barcode.Symbology.CODE128, Barcode.Symbology.CODE39, Barcode.Symbology.CODE93, Barcode.Symbology.GS1_DATABAR],
                        codeDuplicateFilter: 1000
                    })
                }
                onScan={(scanResult) => {

                    console.log(scanResult);
                    //   document.getElementById("scandit-barcode-result").innerHTML = scanResult.barcodes.reduce(function(
                    //     string,
                    //     barcode
                    //   ) {
                    //     return string + Barcode.Symbology.toHumanizedName(barcode.symbology) + ": " + barcode.data + "<br>";
                    //   },
                    //   "");
                }


                }
                onError={(error) => {
                    console.error(error.message);
                }}
            />
        </div>
    );
}

export default App;