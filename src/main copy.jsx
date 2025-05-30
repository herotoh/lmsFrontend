import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 🔽 Add these two imports
import { Provider } from 'react-redux';
import { store } from './store/store.js'; // Make sure you created store.js in /src

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 🔽 Wrap App with Redux Provider */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
