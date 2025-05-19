import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom';

/* 
라우팅 설정을 위해 최상위 컴포넌트인 App을 BrowserRouter 컴포넌트로
랩핑한다. 이렇게 하면 App 컴포넌트 내에서 라우팅 설정을 할 수 있다.
*/
createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)
