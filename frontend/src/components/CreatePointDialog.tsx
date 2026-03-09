import { useState, type FormEvent } from 'react'
import { createMapObject } from '../services/mapObjectService'
import type { CreateMapObjectRequest } from '../types/mapObject'
import Dialog from './Dialog'
import './CreatePointDialog.css'

interface Props {
  isOpen: boolean
  onClose: () => void
  onCreated: () => void
}

export default function CreatePointDialog({ isOpen, onClose, onCreated }: Props) {
  const [form, setForm] = useState<CreateMapObjectRequest>({
    name: '',
    description: '',
    longitude: 0,
    latitude: 0,
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setForm({ name: '', description: '', longitude: 0, latitude: 0 })
    setError(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await createMapObject(form)
      resetForm()
      onCreated()
      onClose()
    } catch {
      setError('Failed to create map object.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title="Create a Point">
      <form onSubmit={handleSubmit} className="create-point-form">
        {error && <p className="error-message">{error}</p>}
        
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            placeholder="Enter point name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Enter description (optional)"
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="longitude">Longitude</label>
            <input
              id="longitude"
              type="number"
              step="any"
              value={form.longitude}
              onChange={(e) =>
                setForm({ ...form, longitude: parseFloat(e.target.value) || 0 })
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="latitude">Latitude</label>
            <input
              id="latitude"
              type="number"
              step="any"
              value={form.latitude}
              onChange={(e) =>
                setForm({ ...form, latitude: parseFloat(e.target.value) || 0 })
              }
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" className="btn-create" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
