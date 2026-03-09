import { useState, type FormEvent } from 'react'
import Dialog from './Dialog'
import './CustomRadiusDialog.css'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: (radiusInMeters: number) => void
}

export default function CustomRadiusDialog({ isOpen, onClose, onConfirm }: Props) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const parsed = parseFloat(value)
    if (isNaN(parsed) || parsed <= 0) {
      setError('Please enter a valid radius greater than 0.')
      return
    }
    onConfirm(parsed * 1000)
    setValue('')
    setError(null)
  }

  const handleClose = () => {
    setValue('')
    setError(null)
    onClose()
  }

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title="Custom Radius">
      <form onSubmit={handleSubmit} className="custom-radius-form">
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="custom-radius-km">Radius (km)</label>
          <input
            id="custom-radius-km"
            type="number"
            min="0.001"
            step="any"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setError(null)
            }}
            placeholder="Enter radius in km"
            autoFocus
          />
        </div>
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" className="btn-confirm">
            Apply
          </button>
        </div>
      </form>
    </Dialog>
  )
}
