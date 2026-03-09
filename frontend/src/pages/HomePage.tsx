import { useEffect, useState, useCallback } from 'react'
import { LatLng } from 'leaflet'
import { getMapObjectsInArea } from '../services/mapObjectService'
import type { MapObjectResponse } from '../types/mapObject'
import Layout from '../components/Layout'
import MapView from '../components/MapView'
import CreatePointDialog from '../components/CreatePointDialog'
import GetPointByIdDialog from '../components/GetPointByIdDialog'
import RadiusSelectDialog from '../components/RadiusSelectDialog'

export default function HomePage() {
  const [mapObjects, setMapObjects] = useState<MapObjectResponse[]>([])
  const [highlightedPointId, setHighlightedPointId] = useState<string | null>(null)
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isGetByIdDialogOpen, setIsGetByIdDialogOpen] = useState(false)
  const [isRadiusDialogOpen, setIsRadiusDialogOpen] = useState(false)
  
  // Location selection state
  const [isSelectingLocation, setIsSelectingLocation] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(null)
  
  // Radius display state
  const [radiusSelection, setRadiusSelection] = useState<{ center: LatLng; radiusInMeters: number } | null>(null)

  const fetchAllObjects = useCallback(() => {
    getMapObjectsInArea(0, 0, 20037508)
      .then(setMapObjects)
      .catch(() => {
        // silently fail, could add error handling UI
      })
  }, [])

  const fetchObjectsInRadius = useCallback((longitude: number, latitude: number, radiusInMeters: number) => {
    getMapObjectsInArea(longitude, latitude, radiusInMeters)
      .then(setMapObjects)
      .catch(() => {
        // silently fail, could add error handling UI
      })
  }, [])

  useEffect(() => {
    fetchAllObjects()
  }, [fetchAllObjects])

  const handleCreatePoint = () => {
    setIsCreateDialogOpen(true)
  }

  const handleGetPointById = () => {
    setIsGetByIdDialogOpen(true)
  }

  const handleGetPointsNearMe = () => {
    setIsSelectingLocation(true)
    setRadiusSelection(null)
    setHighlightedPointId(null)
  }

  const handleMapClick = (latlng: LatLng) => {
    if (isSelectingLocation) {
      setSelectedLocation(latlng)
      setIsSelectingLocation(false)
      setIsRadiusDialogOpen(true)
    }
  }

  const handlePointCreated = () => {
    setRadiusSelection(null)
    fetchAllObjects()
  }

  const handlePointFound = (point: MapObjectResponse) => {
    // Add the point to the map objects if not already present
    setMapObjects((prev) => {
      const exists = prev.some((p) => p.id === point.id)
      if (exists) {
        return prev
      }
      return [...prev, point]
    })
    // Highlight the found point
    setHighlightedPointId(point.id)
    setRadiusSelection(null)
  }

  const handleRadiusConfirm = (radiusInMeters: number) => {
    if (selectedLocation) {
      const center = selectedLocation
      setRadiusSelection({ center, radiusInMeters })
      fetchObjectsInRadius(center.lng, center.lat, radiusInMeters)
      setHighlightedPointId(null)
    }
    setIsRadiusDialogOpen(false)
    setSelectedLocation(null)
  }

  const handleRadiusDialogClose = () => {
    setIsRadiusDialogOpen(false)
    setSelectedLocation(null)
  }

  return (
    <Layout
      onCreatePoint={handleCreatePoint}
      onGetPointById={handleGetPointById}
      onGetPointsNearMe={handleGetPointsNearMe}
    >
      <MapView
        mapObjects={mapObjects}
        highlightedPointId={highlightedPointId}
        radiusSelection={radiusSelection}
        isSelectingLocation={isSelectingLocation}
        onMapClick={handleMapClick}
      />

      <CreatePointDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreated={handlePointCreated}
      />

      <GetPointByIdDialog
        isOpen={isGetByIdDialogOpen}
        onClose={() => setIsGetByIdDialogOpen(false)}
        onPointFound={handlePointFound}
      />

      <RadiusSelectDialog
        isOpen={isRadiusDialogOpen}
        location={selectedLocation}
        onClose={handleRadiusDialogClose}
        onConfirm={handleRadiusConfirm}
      />
    </Layout>
  )
}
