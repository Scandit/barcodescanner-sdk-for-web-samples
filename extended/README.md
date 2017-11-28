# Running the extended sample

## License key
Replace `"-- ENTER YOUR SCANDIT LICENSE KEY HERE --"` in `src/config.js` with your license key. If you don't have a
license key yet, you can sign up for a trial [here](https://ssl.scandit.com/customers/new?p=test&source=websdk).

## Development server

_Make sure you run `npm install` to install the dependencies for the project, including the Scandit Web SDK.  
If you don't know what `npm` is, you can learn more [here](https://www.npmjs.com/#pane-what-is-npm)._

You can simply run `npm start` afterwards to start the development server with live reload and you can dive into the
code!

## Browser Specific Notes for local development

In *Chrome*, you should be able to run the sample without any changes or modifications to the sample or the browser
options.

In *Safari*, you can turn on Developer mode
([learn more](https://support.apple.com/en-us/guide/safari/use-the-safari-develop-menu-sfri20948/mac))
and enable media capture on insecure sites (_Develop > WebRTC > Allow Media Capture on Insecure sites_) to run the
extended sample via `live-server` in Safari.  
For your own safety, disable the option again once you don't need it anymore for the purposes of development.  
_(The local development server is not considered "safe" by Safari and so it's not allowing it to access the camera
by default.)_

For accessing your local development server from a device, a service like [ngrok](https://ngrok.com/) can be used.