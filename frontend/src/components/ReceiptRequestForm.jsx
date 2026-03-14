import { useEffect, useMemo, useState } from 'react'
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

function ReceiptRequestForm() {
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

  const selectedFieldLabels = useMemo(
    () =>
      FIELD_OPTIONS.filter((field) => selectedFields.includes(field.id)).map(
        (field) => field.label,
      ),
    [selectedFields],
  )

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
      <form className="receipt-panel" onSubmit={handleSubmit}>
        <h2>1. Upload Receipt</h2>
        <p className="helper-text">
          Add a clear image. JPG, PNG, and HEIC screenshots usually work best.
        </p>
        <label className="upload-zone" htmlFor="receipt-image">
          <span>{receiptImage ? receiptImage.name : 'Choose receipt image'}</span>
          <input
            id="receipt-image"
            className="upload-input"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            required
          />
        </label>

        <h2>2. Select Data To Extract</h2>
        <p className="helper-text">
          Pick only what you need from the receipt to keep output clean.
        </p>
        <div className="field-actions">
          <button
            type="button"
            className="ghost-button"
            onClick={() => setSelectedFields(FIELD_OPTIONS.map((field) => field.id))}
          >
            Select all
          </button>
          <button
            type="button"
            className="ghost-button"
            onClick={() => setSelectedFields([])}
          >
            Clear
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
                <span className="field-label">{field.label}</span>
                <span className="field-detail">{field.detail}</span>
              </label>
            )
          })}
        </div>

        <h2>3. Output Preferences</h2>
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
          <label htmlFor="other-fields">Other fields (comma separated)</label>
          <input
            id="other-fields"
            type="text"
            placeholder="order id, loyalty points, cashier name"
            value={otherFields}
            onChange={(event) => setOtherFields(event.target.value)}
          />
        </div>
        <div className="inline-group">
          <label htmlFor="instructions">Notes for extraction</label>
          <textarea
            id="instructions"
            rows={3}
            placeholder="Example: focus on totals and ignore promotional text."
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
          />
        </div>

        <button className="submit-button" type="submit">
          Build Extraction Request
        </button>
      </form>

      <aside className="receipt-panel preview-panel">
        <h2>Request Preview</h2>

        {previewUrl ? (
          <img className="receipt-preview-image" src={previewUrl} alt="Uploaded receipt preview" />
        ) : (
          <div className="image-placeholder">Receipt image preview will appear here.</div>
        )}

        <div className="preview-block">
          <h3>Selected fields</h3>
          {selectedFieldLabels.length > 0 ? (
            <ul className="selected-list">
              {selectedFieldLabels.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          ) : (
            <p className="helper-text">No fields selected yet.</p>
          )}
        </div>

        <div className="preview-block">
          <h3>Payload sample</h3>
          <pre>
            {submittedRequest
              ? JSON.stringify(submittedRequest, null, 2)
              : '{\n  "receipt_file": "your-image.jpg",\n  "requested_fields": ["total_amount", "purchase_date"],\n  "output_format": "json"\n}'}
          </pre>
        </div>
      </aside>
    </section>
  )
}

export default ReceiptRequestForm
