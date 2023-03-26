import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

(window as any)['global'] = window;
console.log('urgh')

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <React.StrictMode>
    <App />
//   </React.StrictMode>,
)
