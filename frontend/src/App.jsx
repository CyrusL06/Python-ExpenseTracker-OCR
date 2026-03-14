import { useEffect, useState } from 'react'
import ReceiptRequestForm from './components/ReceiptRequestForm'
import './App.css'

function App() {
  const [apiState, setApiState] = useState('checking')
  const [apiMessage, setApiMessage] = useState('Checking Django backend...')

  useEffect(() => {
    let cancelled = false

    fetch('http://127.0.0.1:8000/api/hello/')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        if (cancelled) {
          return
        }
        setApiState('online')
        setApiMessage(data?.message || 'Backend is running.')
      })
      .catch(() => {
        if (cancelled) {
          return
        }
        setApiState('offline')
        setApiMessage('Could not reach http://127.0.0.1:8000/api/hello/.')
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="app-shell">
      <header className="app-header">
        <span className={`status-chip status-${apiState}`}>
          {apiState === 'online'
            ? 'Backend Online'
            : apiState === 'offline'
              ? 'Backend Offline'
              : 'Checking Backend'}
        </span>
        <h1>Receipt Intake Form</h1>
        <p>{apiMessage}</p>
      </header>

      <ReceiptRequestForm />
    </main>
  )
}

export default App
