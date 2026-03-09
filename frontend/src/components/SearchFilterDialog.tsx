import { useState, type FormEvent } from 'react'
import type { LatLng } from 'leaflet'
import Dialog from './Dialog'
import './SearchFilterDialog.css'

interface Props {
  isOpen: boolean
  location: LatLng | null
  radiusInMeters: number
  onClose: () => void
  onConfirm: (nameFilter: string) => void
}

export default function SearchFilterDialog({
  isOpen,
  location,
  radiusInMeters,
  onClose,
  onConfirm,
}: Props) {
  const [nameFilter, setNameFilter] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onConfirm(nameFilter)
  }

  const handleClose = () => {
    setNameFilter('')
    onClose()
  }

  const formatRadius = (meters: number) => {
    if (meters >= 1000) return `${meters / 1000} km`
    return `${meters} m`
  }

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title="Search Filter">
      <form onSubmit={handleSubmit} className="search-filter-form">
        {location && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sf-latitude">Latitude</label>
              <input
                id="sf-latitude"
                type="text"
                value={location.lat.toFixed(6)}
                readOnly
                className="readonly-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="sf-longitude">Longitude</label>
              <input
                id="sf-longitude"
                type="text"
                value={location.lng.toFixed(6)}
                readOnly
                className="readonly-input"
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="sf-radius">Radius</label>
          <input
            id="sf-radius"
            type="text"
            value={formatRadius(radiusInMeters)}
            readOnly
            className="readonly-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="sf-name">Name filter (optional)</label>
          <input
            id="sf-name"
            type="text"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Filter by name..."
            autoFocus
          />
        </div>

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
