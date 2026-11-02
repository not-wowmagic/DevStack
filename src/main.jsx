import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

const rootElement = document.getElementById('root')

// If a prerendered snapshot is present, let React own a clean container.
if (rootElement.hasChildNodes()) {
    rootElement.replaceChildren()
}

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
