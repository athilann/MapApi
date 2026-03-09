import type { MapObjectResponse } from '../types/mapObject'

interface Props {
  mapObjects: MapObjectResponse[]
}

export default function MapObjectList({ mapObjects }: Props) {
  if (mapObjects.length === 0) {
    return <p>No map objects found.</p>
  }

  return (
    <ul>
      {mapObjects.map((obj) => (
        <li key={obj.id}>
          <strong>{obj.name}</strong> — {obj.description} ({obj.longitude},{' '}
          {obj.latitude})
        </li>
      ))}
    </ul>
  )
}
