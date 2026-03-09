import { useState, type FormEvent } from 'react'
import { createMapObject } from '../services/mapObjectService'
import type { CreateMapObjectRequest } from '../types/mapObject'

interface Props {
  onCreated: () => void
}

export default function MapObjectForm({ onCreated }: Props) {
  const [form, setForm] = useState<CreateMapObjectRequest>({
    name: '',
    description: '',
    longitude: 0,
    latitude: 0,
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await createMapObject(form)
      setForm({ name: '', description: '', longitude: 0, latitude: 0 })
      onCreated()
    } catch {
      setError('Failed to create map object.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Map Object</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>
          Name:{' '}
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Description:{' '}
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
      </div>
      <div>
        <label>
          Longitude:{' '}
          <input
            type="number"
            step="any"
            value={form.longitude}
            onChange={(e) =>
              setForm({ ...form, longitude: parseFloat(e.target.value) || 0 })
            }
            required
          />
        </label>
      </div>
      <div>
        <label>
          Latitude:{' '}
          <input
            type="number"
            step="any"
            value={form.latitude}
            onChange={(e) =>
              setForm({ ...form, latitude: parseFloat(e.target.value) || 0 })
            }
            required
          />
        </label>
      </div>
      <button type="submit">Create</button>
    </form>
  )
}
