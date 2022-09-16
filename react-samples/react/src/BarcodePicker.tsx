import { MutableRefObject, useEffect, useRef, useState } from "react";
import { BarcodePicker as ScanditSDKBarcodePicker, ScanResult } from "scandit-sdk";

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;

type CreateArguments = ArgumentTypes<typeof ScanditSDKBarcodePicker.create>[1];

type Props = {
    onScan?: (scanResult: ScanResult) => void,
    onError?: (error: Error) => void
} & CreateArguments;

const BarcodePicker =  ({ onScan, onError, ...createProps }: Props) => {
    //TODO: what?
    const ref = useRef() as MutableRefObject<HTMLInputElement>;
    const [barcodePicker, setBarcodePicker] = useState<ScanditSDKBarcodePicker | null>(null)

    useEffect(() => {
        (async () => {
            const result = await ScanditSDKBarcodePicker.create(ref.current, createProps);

            onScan && result.on("scan", onScan);
            onError && result.on("scanError", onError);

            setBarcodePicker(result);

            return () => {
                barcodePicker?.destroy();
                setBarcodePicker(null);
            }
        })()
    }, []);


    // TODO: better update action?
    useEffect(() => {
        createProps?.visible && barcodePicker?.setVisible(createProps.visible);
    }, [createProps.visible]);

    useEffect(() => {
        createProps?.scanSettings && barcodePicker?.applyScanSettings(createProps.scanSettings);
    }, [createProps.scanSettings]);

    return <div ref={ref} className="barcode" />;

}

export default BarcodePicker;