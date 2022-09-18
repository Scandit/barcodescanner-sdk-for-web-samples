# React Demo - Scandit Web SDK

Web application based barcode scan tool.
More information [here](https://docs.scandit.com/stable/web/)  

# Before start

According to [documentation](https://docs.scandit.com/stable/web/#configuration) you need a license key. 

Please, create a .env file, and put the key there as follows

```
REACT_APP_KEY=<license-key>
```
It will be used for development. 

# Start

## Development
```
npm ci && npm run start 
```
## Produciton
```
npm ci && npm run build 
```
Production code will be in /build folder

### NB

This project requires sdk files in ```public``` forlder. They will be copied after first ```npm ci``` run.