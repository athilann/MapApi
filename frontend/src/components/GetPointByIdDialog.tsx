import { useState, type FormEvent } from 'react'
import { getMapObjectById } from '../services/mapObjectService'
import type { MapObjectResponse } from '../types/mapObject'
import Dialog from './Dialog'
import './GetPointByIdDialog.css'

interface Props {
  isOpen: boolean
  onClose: () => void
  onPointFound: (point: MapObjectResponse) => void
}

export default function GetPointByIdDialog({ isOpen, onClose, onPointFound }: Props) {
  const [id, setId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const resetForm = () => {
    setId('')
    setError(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!id.trim()) {
      setError('Please enter a point ID')
      return
    }

    setError(null)
    setIsSearching(true)

    try {
      const point = await getMapObjectById(id.trim())
      resetForm()
      onPointFound(point)
      onClose()
    } catch {
      setError('Point not found or failed to fetch.')
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title="Get Point by ID">
      <form onSubmit={handleSubmit} className="get-point-form">
        {error && <p className="error-message">{error}</p>}
        
        <div className="form-group">
          <label htmlFor="point-id">Point ID</label>
          <input
            id="point-id"
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter the point ID"
            autoFocus
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" className="btn-search" disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Find Point'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
