import { useEffect, useState } from 'react'
import { getMapObjectsInArea } from '../services/mapObjectService'
import type { MapObjectResponse } from '../types/mapObject'
import MapObjectList from '../components/MapObjectList'
import MapObjectForm from '../components/MapObjectForm'

export default function HomePage() {
  const [mapObjects, setMapObjects] = useState<MapObjectResponse[]>([])
  const [error, setError] = useState<string | null>(null)

  const fetchObjects = () => {
    getMapObjectsInArea(0, 0, 20037508)
      .then(setMapObjects)
      .catch(() => setError('Failed to load map objects.'))
  }

  useEffect(() => {
    fetchObjects()
  }, [])

  return (
    <div>
      <h1>Map Objects</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <MapObjectList mapObjects={mapObjects} />
      <hr />
      <MapObjectForm onCreated={fetchObjects} />
    </div>
  )
}
