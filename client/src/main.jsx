import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store.js'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import {Toaster} from 'react-hot-toast'
import AuthInitializer from './components/common/AuthInitializer';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AuthInitializer>
        <RouterProvider router={router}>
        <App />
        </RouterProvider>
        <Toaster/>
      </AuthInitializer>
    </Provider>
  </StrictMode>,
)
