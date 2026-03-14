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

  const today = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date())

  const statusLabel =
    apiState === 'online'
      ? 'Backend Linked'
      : apiState === 'offline'
        ? 'Signal Lost'
        : 'Checking Link'

  return (
    <main className="app-shell">
      <aside className="side-rail" aria-label="Application rail">
        <p className="rail-mark">OCR / DJANGO</p>
        <div className="rail-block">
          <span className="rail-label">Desk</span>
          <strong className="rail-value">03</strong>
        </div>
        <div className={`rail-block rail-status rail-status-${apiState}`}>
          <span className="rail-label">Status</span>
          <strong className="rail-value">{statusLabel}</strong>
        </div>
      </aside>

      <section className="workspace">
        <header className="masthead">
          <div className="inspection-stripe" aria-hidden="true">
            <span>SCAN IN PROGRESS</span>
          </div>

          <div className="masthead-meta">
            <span className="meta-tag">Receipt Intake Desk</span>
            <span className="meta-tag">{today}</span>
          </div>

          <div className="masthead-grid">
            <div className="headline-block">
              <p className="eyebrow">Thermal receipt parsing / extraction command</p>
              <h1>OCR FIELD COMMAND</h1>
            </div>

            <div className="mission-panel">
              <p className="mission-label">Live backend note</p>
              <p className="mission-copy">{apiMessage}</p>
              <div className="mission-foot">
                <span>Output scope: structured fields only</span>
                <span>Mode: local request staging</span>
              </div>
            </div>
          </div>
        </header>

        <ReceiptRequestForm statusLabel={statusLabel} />
      </section>
    </main>
  )
}

export default App
