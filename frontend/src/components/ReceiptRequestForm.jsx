import { useEffect, useState } from 'react'
import './ReceiptRequestForm.css'

const FIELD_OPTIONS = [
  { id: 'merchant_name', label: 'Merchant Name', detail: 'Store or vendor name.' },
  { id: 'purchase_date', label: 'Purchase Date', detail: 'Date shown on receipt.' },
  { id: 'total_amount', label: 'Total Cost', detail: 'Final charged amount.' },
  { id: 'subtotal', label: 'Subtotal', detail: 'Amount before taxes and tips.' },
  { id: 'tax_amount', label: 'Tax', detail: 'Collected sales tax amount.' },
  { id: 'tip_amount', label: 'Tip', detail: 'Tip or gratuity amount.' },
  { id: 'payment_method', label: 'Payment Method', detail: 'Card, cash, or wallet type.' },
  { id: 'receipt_address', label: 'Merchant Address', detail: 'Location where money was spent.' },
  { id: 'line_items', label: 'Line Items', detail: 'Itemized purchases and prices.' },
  { id: 'currency', label: 'Currency', detail: 'Currency code used in totals.' },
]

const DEFAULT_FIELDS = ['merchant_name', 'purchase_date', 'total_amount', 'currency']

function ReceiptRequestForm({ statusLabel }) {
  const [selectedFields, setSelectedFields] = useState(DEFAULT_FIELDS)
  const [receiptImage, setReceiptImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [outputFormat, setOutputFormat] = useState('json')
  const [otherFields, setOtherFields] = useState('')
  const [instructions, setInstructions] = useState('')
  const [submittedRequest, setSubmittedRequest] = useState(null)

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const selectedFieldLabels = FIELD_OPTIONS.filter((field) =>
    selectedFields.includes(field.id),
  ).map((field) => field.label)

  const payloadPreview = submittedRequest
    ? JSON.stringify(submittedRequest, null, 2)
    : '{\n  "receipt_file": "sample-ticket.jpg",\n  "requested_fields": ["merchant_name", "total_amount", "currency"],\n  "output_format": "json"\n}'

  const toggleField = (id) => {
    setSelectedFields((current) =>
      current.includes(id)
        ? current.filter((fieldId) => fieldId !== id)
        : [...current, id],
    )
  }

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setReceiptImage(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!receiptImage) {
      return
    }

    const customFields = otherFields
      .split(',')
      .map((field) => field.trim())
      .filter(Boolean)

    setSubmittedRequest({
      receipt_file: receiptImage.name,
      requested_fields: [...selectedFields, ...customFields],
      output_format: outputFormat,
      instructions: instructions.trim() || null,
      submitted_at: new Date().toISOString(),
    })
  }

  return (
    <section className="receipt-layout">
      <form className="control-board" onSubmit={handleSubmit}>
        <div className="board-head">
          <div>
            <p className="board-kicker">Input staging</p>
            <h2>Receipt Request Sheet</h2>
          </div>
          <div className="board-badges">
            <span className="board-badge">Link: {statusLabel}</span>
            <span className="board-badge">Fields: {selectedFields.length}</span>
          </div>
        </div>

        <section className="board-section">
          <div className="section-heading">
            <span className="section-index">01</span>
            <div>
              <h3>Capture source image</h3>
              <p className="helper-text">
                Use a straight-on receipt photo. JPG, PNG, and HEIC all work here.
              </p>
            </div>
          </div>

          <label className="upload-zone" htmlFor="receipt-image">
            <span className="upload-label">Drop or choose receipt image</span>
            <strong className="upload-filename">
              {receiptImage ? receiptImage.name : 'No file staged yet'}
            </strong>
            <input
              id="receipt-image"
              className="upload-input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              required
            />
          </label>
        </section>

        <div className="board-split">
          <section className="board-section">
            <div className="section-heading">
              <span className="section-index">02</span>
              <div>
                <h3>Mark extraction targets</h3>
                <p className="helper-text">
                  Keep the request surgical. Only select fields you actually want returned.
                </p>
              </div>
            </div>

            <div className="field-actions">
              <button
                type="button"
                className="utility-button"
                onClick={() => setSelectedFields(FIELD_OPTIONS.map((field) => field.id))}
              >
                Mark all
              </button>
              <button
                type="button"
                className="utility-button"
                onClick={() => setSelectedFields([])}
              >
                Clear sheet
              </button>
            </div>

            <div className="field-grid">
              {FIELD_OPTIONS.map((field) => {
                const checked = selectedFields.includes(field.id)
                return (
                  <label
                    key={field.id}
                    className={`field-option ${checked ? 'is-selected' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleField(field.id)}
                    />
                    <span className="field-copy">
                      <span className="field-label">{field.label}</span>
                      <span className="field-detail">{field.detail}</span>
                    </span>
                  </label>
                )
              })}
            </div>
          </section>

          <section className="board-section board-section-tight">
            <div className="section-heading">
              <span className="section-index">03</span>
              <div>
                <h3>Set output behavior</h3>
                <p className="helper-text">
                  Define the shape of the response before the parser touches the receipt.
                </p>
              </div>
            </div>

            <div className="inline-group">
              <label htmlFor="output-format">Output format</label>
              <select
                id="output-format"
                value={outputFormat}
                onChange={(event) => setOutputFormat(event.target.value)}
              >
                <option value="json">JSON</option>
                <option value="table">Table</option>
                <option value="summary">Summary text</option>
              </select>
            </div>

            <div className="inline-group">
              <label htmlFor="other-fields">Additional fields</label>
              <input
                id="other-fields"
                type="text"
                placeholder="order id, cashier name, loyalty points"
                value={otherFields}
                onChange={(event) => setOtherFields(event.target.value)}
              />
            </div>

            <div className="inline-group">
              <label htmlFor="instructions">Extraction notes</label>
              <textarea
                id="instructions"
                rows={5}
                placeholder="Example: ignore promo copy and prioritize totals near the footer."
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
              />
            </div>
          </section>
        </div>

        <div className="action-row">
          <p className="action-note">Requests are staged locally until backend parsing is wired in.</p>
          <button className="submit-button" type="submit">
            Stamp Request
          </button>
        </div>
      </form>

      <aside className="evidence-stage">
        <div className="preview-frame">
          <div className="preview-header">
            <span>Live image sample</span>
            <span>{outputFormat}</span>
          </div>

          {previewUrl ? (
            <div className="preview-surface has-image">
              <img
                className="receipt-preview-image"
                src={previewUrl}
                alt="Uploaded receipt preview"
              />
              <span className="preview-stamp">Verified</span>
            </div>
          ) : (
            <div className="preview-surface">
              <div className="image-placeholder">
                <strong>Awaiting receipt upload</strong>
                <span>The scan field will animate once an image lands here.</span>
              </div>
            </div>
          )}
        </div>

        <div className="receipt-tape">
          <div className="tape-head">
            <span>Thermal strip</span>
            <span>{selectedFieldLabels.length} picks</span>
          </div>

          {selectedFieldLabels.length > 0 ? (
            <ol className="tape-list">
              {selectedFieldLabels.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ol>
          ) : (
            <p className="tape-empty">No fields selected yet.</p>
          )}
        </div>

        <div className="payload-panel">
          <div className="payload-head">
            <span>Payload specimen</span>
            <span>Local preview</span>
          </div>
          <pre>{payloadPreview}</pre>
        </div>
      </aside>
    </section>
  )
}

export default ReceiptRequestForm
