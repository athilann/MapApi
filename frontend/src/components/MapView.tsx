import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle, useMap } from 'react-leaflet'
import { LatLng, Icon, type LeafletMouseEvent } from 'leaflet'
import type { MapObjectResponse } from '../types/mapObject'
import './MapView.css'

// Fix for default marker icons in Leaflet with webpack/vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const defaultIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const highlightedIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [35, 57],
  iconAnchor: [17, 57],
  popupAnchor: [1, -47],
  shadowSize: [57, 57],
  className: 'highlighted-marker',
})

const RADIUS_OPTIONS = [
  { label: '1 km', value: 1000 },
  { label: '5 km', value: 5000 },
  { label: '10 km', value: 10000 },
  { label: '50 km', value: 50000 },
  { label: '100 km', value: 100000 },
  { label: 'Custom', value: -1 },
]

interface Props {
  mapObjects: MapObjectResponse[]
  highlightedPointId?: string | null
  radiusSelection?: { center: LatLng; radiusInMeters: number } | null
  isSelectingLocation?: boolean
  onMapClick?: (latlng: LatLng) => void
  userLocation?: LatLng | null
  radiusSelectValue: number
  onRadiusChange: (value: number) => void
}

function MapClickHandler({ onClick }: { onClick: (latlng: LatLng) => void }) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onClick(e.latlng)
    },
  })
  return null
}

function FlyToLocation({ location }: { location: LatLng }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(location, 13)
  }, [map, location])
  return null
}

export default function MapView({
  mapObjects,
  highlightedPointId,
  radiusSelection,
  isSelectingLocation,
  onMapClick,
  userLocation,
  radiusSelectValue,
  onRadiusChange,
}: Props) {
  const defaultCenter: [number, number] = [51.505, -0.09] // London
  const defaultZoom = 3

  return (
    <div className={`map-container ${isSelectingLocation ? 'selecting-location' : ''}`}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        className="map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {onMapClick && <MapClickHandler onClick={onMapClick} />}
        {userLocation && <FlyToLocation location={userLocation} />}
        
        {mapObjects.map((obj) => (
          <Marker
            key={obj.id}
            position={[obj.latitude, obj.longitude]}
            icon={obj.id === highlightedPointId ? highlightedIcon : defaultIcon}
          >
            <Popup>
              <div className="popup-content">
                <p><strong>ID:</strong> {obj.id}</p>
                <p><strong>Name:</strong> {obj.name}</p>
                <p><strong>Description:</strong> {obj.description || 'N/A'}</p>
                <p><strong>Longitude:</strong> {obj.longitude}</p>
                <p><strong>Latitude:</strong> {obj.latitude}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {radiusSelection && (
          <Circle
            center={radiusSelection.center}
            radius={radiusSelection.radiusInMeters}
            pathOptions={{ color: '#2196f3', fillColor: '#2196f3', fillOpacity: 0.2 }}
          />
        )}
      </MapContainer>

      {isSelectingLocation && (
        <div className="selecting-overlay">
          Click on the map to select a location
        </div>
      )}

      <div className="radius-selector">
        <label htmlFor="radius-select" className="radius-label">Radius</label>
        <select
          id="radius-select"
          value={radiusSelectValue}
          onChange={(e) => onRadiusChange(parseInt(e.target.value, 10))}
          className="radius-select"
        >
          {RADIUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
