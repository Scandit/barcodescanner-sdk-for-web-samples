import { ViewFunctions } from "./helpers";
import { Elements } from "./elements";
import { App } from "./app";

export let app;

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        ViewFunctions.setup();
        Elements.setup();
        app = new App();
        app.start();
    }
}