import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import BookingPage from './pages/BookingPage.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppContextProvider } from './Context/AppContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
          <Route path="/booking" element={<BookingPage />} />
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  </StrictMode>
)