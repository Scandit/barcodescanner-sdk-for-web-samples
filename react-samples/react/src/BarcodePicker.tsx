import { MutableRefObject, useEffect, useRef, useState } from "react";
import { configure, BarcodePicker as ScanditSDKBarcodePicker, ScanResult } from "scandit-sdk";

const key = "ARjSjCuOCYsaK+oTvC83K3gFmGl+G/6qdE81TZBnwrt+SHzj9Xeg2r9b5GP1VP+bqm7zRGAH7wCQOcPOhUxKByYR5R1yejUeRmQvvx5WtKI0OUT4qSzpWTBFABOyGLJZz7oSkdQ5ySK0eQPaA393tY77EniTJURygKe7BU7rGrGwiIPbFTp4NLm4CbKU62T179jg6t20Ic4wus/id6dehAYXLWcWwacFX7HwZu+yg1mDXhXo2AV5TqUSIv6Y7RZUisCrmsTslbjv+n7xADzT6nziQxbyU6N7ETCihdp1lMJ8h6mBPjMgeJ272d2cxPEFdFkK4qSUCt9YJ8egHhaQD3feXf+r4/T2Q1E2HgYy6q3sbdb7xj9p45OV2ebDwNM2Fiz4YrQh4xYy47chsVRvG2S2Dgz2ssxzSz+FDkmQhCLVeF/hdiE5NQRKT06EbDQagWt5ddABnhBcEQawvsdNir9jGXE3wY5Ye3p9iOfclV89ooCqjmFV5lxGgMMTtdnWkb4uPATu9G+J3J0RQqGrAqZQroN/Miqy1htWflGJvpE/8vKgGqKADhWAkO9OBeqRqV0cykmWxXp78fhG6Fn6B+wJA4uAOWdJDpw0vmeVqb7H7896FgQ9fmz215I70MzoOKj7xxRE6A7jXjJngWO29eRv4QS3+07Vvf65TWKyx2bN6mSPnt6+op+5NQPoN8VkEVS55NCyLA0pna5J0VlwKg04wl2NU2nX+FJRuvmrwfHMrZwBIi6KgewSAdQPABs81uVGiB5d7wvRGJcG8IO3JdqbEHvjh7Qgxd5QB2bpng=="

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;

type CreateArguments = ArgumentTypes<typeof ScanditSDKBarcodePicker.create>[1];

type Props = {
    onScan?: (scanResult: ScanResult) => void,
    onError?: (error: Error) => void
} & CreateArguments;

const BarcodePicker = ({ onScan, onError, ...createProps }: Props) => {
    //TODO: what?
    const ref = useRef() as MutableRefObject<HTMLInputElement>;
    const [barcodePicker, setBarcodePicker] = useState<ScanditSDKBarcodePicker | null>(null)
    const [error, setError] = useState();

    useEffect(() => {


        (async () => {

            try {
                await configure(key);
            } catch (error: any) {
                console.error(error);
                setError(error);

            }

            //TODO: move it out of sync

            if (!ref.current) {
                return;
            }

            const result = await ScanditSDKBarcodePicker.create(ref.current, createProps);

            onScan && result.on("scan", onScan);
            onError && result.on("scanError", onError);

            setBarcodePicker(result);

            return () => {
                barcodePicker?.destroy();
                setBarcodePicker(null);
            }
        })()

    }, [ref.current]);


    // TODO: better update action?
    useEffect(() => {
        createProps?.visible && barcodePicker?.setVisible(createProps.visible);
    }, [createProps.visible]);

    useEffect(() => {
        createProps?.scanSettings && barcodePicker?.applyScanSettings(createProps.scanSettings);
    }, [createProps.scanSettings]);




    return (<>
        <div ref={ref} className="barcode" />
        {error && <span>Sorry something goes wrong</span>}
    </>);

}

export default BarcodePicker;