import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { configure } from 'scandit-sdk';

const key = process.env.REACT_APP_KEY || '';

configure(key, {
    engineLocation: "sdk"
}).then(()=>{
    const root = ReactDOM.createRoot(
        document.getElementById('root') as HTMLElement
    );
    root.render(
        <App />
    );
}).catch((error)=>{
    console.error(error);
})