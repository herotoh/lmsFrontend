import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './store/store'
import { Provider } from 'react-redux';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 🔽 Wrap App with Redux Provider */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)