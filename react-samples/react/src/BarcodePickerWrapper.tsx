import { memo, MutableRefObject, useEffect, useRef } from "react";
import { ScanResult, BarcodePicker } from "scandit-sdk";

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;

type CreateProps = ArgumentTypes<typeof BarcodePicker.create>[1];

type Props = {
    onScan?: (scanResult: ScanResult) => void,
    onError?: (error: Error) => void
} & CreateProps;

const BarcodePickerWrapper = ({ onScan, onError, ...createProps }: Props) => {
    const ref = useRef() as MutableRefObject<HTMLInputElement>;

    useEffect(() => {
        let barcodePicker: BarcodePicker;
        (async () => {
            barcodePicker = await BarcodePicker.create(ref.current, createProps);

            onScan && barcodePicker.on("scan", onScan);
            onError && barcodePicker.on("scanError", onError);
        })()
        return () => barcodePicker?.destroy();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div ref={ref} className="barcode"/>;
}

export default memo(BarcodePickerWrapper);