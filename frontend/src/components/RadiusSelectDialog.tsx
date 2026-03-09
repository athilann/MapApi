import { useState, type FormEvent } from 'react'
import type { LatLng } from 'leaflet'
import Dialog from './Dialog'
import './RadiusSelectDialog.css'

interface Props {
  isOpen: boolean
  location: LatLng | null
  onClose: () => void
  onConfirm: (radiusInMeters: number) => void
}

const radiusOptions = [
  { label: '100 meters', value: 100 },
  { label: '500 meters', value: 500 },
  { label: '1 km', value: 1000 },
  { label: '5 km', value: 5000 },
  { label: '10 km', value: 10000 },
  { label: '50 km', value: 50000 },
  { label: '100 km', value: 100000 },
  { label: 'Custom', value: -1 },
]

export default function RadiusSelectDialog({ isOpen, location, onClose, onConfirm }: Props) {
  const [selectedRadius, setSelectedRadius] = useState(1000)
  const [customRadius, setCustomRadius] = useState('')
  const [showCustom, setShowCustom] = useState(false)

  const handleRadiusChange = (value: number) => {
    if (value === -1) {
      setShowCustom(true)
    } else {
      setShowCustom(false)
      setSelectedRadius(value)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    let radius = selectedRadius
    if (showCustom) {
      const parsed = parseFloat(customRadius)
      if (isNaN(parsed) || parsed <= 0) {
        return
      }
      radius = parsed
    }
    
    onConfirm(radius)
  }

  const handleClose = () => {
    setSelectedRadius(1000)
    setCustomRadius('')
    setShowCustom(false)
    onClose()
  }

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title="Select Search Radius">
      <form onSubmit={handleSubmit} className="radius-form">
        {location && (
          <p className="location-info">
            Selected location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </p>
        )}
        
        <div className="radius-options">
          {radiusOptions.map((option) => (
            <label key={option.value} className="radius-option">
              <input
                type="radio"
                name="radius"
                value={option.value}
                checked={option.value === -1 ? showCustom : selectedRadius === option.value && !showCustom}
                onChange={() => handleRadiusChange(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>

        {showCustom && (
          <div className="custom-radius">
            <label htmlFor="custom-radius">Custom radius (meters)</label>
            <input
              id="custom-radius"
              type="number"
              min="1"
              value={customRadius}
              onChange={(e) => setCustomRadius(e.target.value)}
              placeholder="Enter radius in meters"
              autoFocus
            />
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" className="btn-confirm">
            Search
          </button>
        </div>
      </form>
    </Dialog>
  )
}
