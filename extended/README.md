To get started with the Scandit Web SDK, take a look at the [documentation](http://docs.scandit.com/stable/web/index.html).

# Running the extended sample

## License key
Replace `"-- ENTER YOUR SCANDIT LICENSE KEY HERE --"` in `src/config.js` with your license key. If you don't have a
license key yet, you can sign up for a trial [here](https://ssl.scandit.com/customers/new?p=test&source=websdk).

## Local server

_Make sure you run `npm install` to install the dependencies for the project, including the Scandit Web SDK.  
If you don't know what `npm` is, you can learn more [here](https://www.npmjs.com/#pane-what-is-npm)._

You can simply run `npm start` afterwards to start the development server with live reload and you can dive into the
code!


```bash
npm install
npm start
```

## Notes for local development on a device

For accessing your local development server from a device other than your development machine, a service like
[ngrok](https://ngrok.com/) can be used.  
If the local development server is running, you can get a publicly available address to access it with the following
commands that assume that the local server is accessible on port 8080:
```bash
npm i ngrok -g
ngrok http 8080 -host-header="localhost:8080"
```

_You'll be able to access the development server through both `http` and `https`, you should use `https` because of
possible browser restrictions._

# Browser restrictions

HTTPS is needed by browsers for security reasons as the Scandit Web SDK library asks for camera access. To learn more
about browser support and other important notes, take a look at the [Web SDK documentation](http://docs.scandit.com/stable/web/index.html#important-notes).