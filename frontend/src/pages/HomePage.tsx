import { useEffect, useState, useCallback, useRef } from 'react'
import { LatLng } from 'leaflet'
import { getMapObjectsInArea } from '../services/mapObjectService'
import type { MapObjectResponse } from '../types/mapObject'
import Layout from '../components/Layout'
import MapView from '../components/MapView'
import CreatePointDialog from '../components/CreatePointDialog'
import SearchFilterDialog from '../components/SearchFilterDialog'
import CustomRadiusDialog from '../components/CustomRadiusDialog'

type MapMode = 'default' | 'search' | 'create'

const DEFAULT_RADIUS = 5000

export default function HomePage() {
  const [mapObjects, setMapObjects] = useState<MapObjectResponse[]>([])

  // Radius state — in meters
  const [radiusInMeters, setRadiusInMeters] = useState(DEFAULT_RADIUS)
  // Dropdown selected value: a fixed option value or -1 for custom
  const [radiusSelectValue, setRadiusSelectValue] = useState(DEFAULT_RADIUS)
  const [isCustomRadiusDialogOpen, setIsCustomRadiusDialogOpen] = useState(false)

  // Current map center (used when radius changes to re-filter)
  const [currentCenter, setCurrentCenter] = useState<LatLng | null>(null)

  // Radius circle shown on map
  const [radiusSelection, setRadiusSelection] = useState<{ center: LatLng; radiusInMeters: number } | null>(null)

  // Map interaction mode
  const [mapMode, setMapMode] = useState<MapMode>('default')
  const [isSelectingLocation, setIsSelectingLocation] = useState(false)

  // Selected location from map click (for dialogs)
  const [clickedLocation, setClickedLocation] = useState<LatLng | null>(null)

  // Dialog states
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // User geolocation — stored so FlyToLocation in MapView can fly there
  const [userLocation, setUserLocation] = useState<LatLng | null>(null)

  // Keep radius ref for callbacks that close over stale radius
  const radiusRef = useRef(radiusInMeters)
  useEffect(() => {
    radiusRef.current = radiusInMeters
  }, [radiusInMeters])

  const fetchObjectsInRadius = useCallback(
    (longitude: number, latitude: number, radius: number, nameFilter?: string) => {
      getMapObjectsInArea(longitude, latitude, radius)
        .then((results) => {
          if (nameFilter && nameFilter.trim()) {
            const lower = nameFilter.trim().toLowerCase()
            setMapObjects(results.filter((obj) => obj.name.toLowerCase().includes(lower)))
          } else {
            setMapObjects(results)
          }
        })
        .catch(() => {
          // silently fail, could add error handling UI
        })
    },
    [],
  )

  // On load: get user location, center map, and fetch nearby objects
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = new LatLng(position.coords.latitude, position.coords.longitude)
          setUserLocation(loc)
          setCurrentCenter(loc)
          setRadiusSelection({ center: loc, radiusInMeters: radiusRef.current })
          fetchObjectsInRadius(loc.lng, loc.lat, radiusRef.current)
        },
        () => {
          // Geolocation denied/unavailable — fall back to London
          const london = new LatLng(51.505, -0.09)
          setCurrentCenter(london)
          fetchObjectsInRadius(london.lng, london.lat, radiusRef.current)
        },
      )
    } else {
      const london = new LatLng(51.505, -0.09)
      setCurrentCenter(london)
      fetchObjectsInRadius(london.lng, london.lat, radiusRef.current)
    }
  }, [fetchObjectsInRadius])

  // When radius changes, re-apply filter from current center
  const handleRadiusChange = (value: number) => {
    if (value === -1) {
      // Custom — open dialog
      setRadiusSelectValue(-1)
      setIsCustomRadiusDialogOpen(true)
      return
    }
    setRadiusSelectValue(value)
    setRadiusInMeters(value)
    if (currentCenter) {
      setRadiusSelection({ center: currentCenter, radiusInMeters: value })
      fetchObjectsInRadius(currentCenter.lng, currentCenter.lat, value)
    }
  }

  const handleCustomRadiusConfirm = (meters: number) => {
    setIsCustomRadiusDialogOpen(false)
    setRadiusInMeters(meters)
    // Keep radiusSelectValue as -1 to show "Custom" in the dropdown
    if (currentCenter) {
      setRadiusSelection({ center: currentCenter, radiusInMeters: meters })
      fetchObjectsInRadius(currentCenter.lng, currentCenter.lat, meters)
    }
  }

  const handleCustomRadiusClose = () => {
    setIsCustomRadiusDialogOpen(false)
    // Revert dropdown to the last valid fixed option if user cancels
    setRadiusSelectValue(radiusInMeters)
  }

  // SEARCH button
  const handleSearchClick = () => {
    setMapMode('search')
    setIsSelectingLocation(true)
  }

  // CREATE (+) button
  const handleCreateClick = () => {
    setMapMode('create')
    setIsSelectingLocation(true)
  }

  const handleMapClick = (latlng: LatLng) => {
    if (mapMode === 'search') {
      setClickedLocation(latlng)
      setIsSelectingLocation(false)
      setMapMode('default')
      setIsSearchDialogOpen(true)
    } else if (mapMode === 'create') {
      setClickedLocation(latlng)
      setIsSelectingLocation(false)
      setMapMode('default')
      setIsCreateDialogOpen(true)
    } else {
      // Default: filter around clicked point
      setCurrentCenter(latlng)
      setRadiusSelection({ center: latlng, radiusInMeters })
      fetchObjectsInRadius(latlng.lng, latlng.lat, radiusInMeters)
    }
  }

  // Search dialog confirmed
  const handleSearchConfirm = (nameFilter: string) => {
    if (clickedLocation) {
      const center = clickedLocation
      setCurrentCenter(center)
      setRadiusSelection({ center, radiusInMeters })
      fetchObjectsInRadius(center.lng, center.lat, radiusInMeters, nameFilter)
    }
    setIsSearchDialogOpen(false)
    setClickedLocation(null)
  }

  const handleSearchDialogClose = () => {
    setIsSearchDialogOpen(false)
    setClickedLocation(null)
  }

  // Point created
  const handlePointCreated = () => {
    if (currentCenter) {
      fetchObjectsInRadius(currentCenter.lng, currentCenter.lat, radiusInMeters)
    }
  }

  const handleCreateDialogClose = () => {
    setIsCreateDialogOpen(false)
    setClickedLocation(null)
  }

  return (
    <Layout onSearch={handleSearchClick} onCreatePoint={handleCreateClick}>
      <MapView
        mapObjects={mapObjects}
        radiusSelection={radiusSelection}
        isSelectingLocation={isSelectingLocation}
        onMapClick={handleMapClick}
        userLocation={userLocation}
        radiusSelectValue={radiusSelectValue}
        onRadiusChange={handleRadiusChange}
      />

      <SearchFilterDialog
        isOpen={isSearchDialogOpen}
        location={clickedLocation}
        radiusInMeters={radiusInMeters}
        onClose={handleSearchDialogClose}
        onConfirm={handleSearchConfirm}
      />

      <CreatePointDialog
        isOpen={isCreateDialogOpen}
        onClose={handleCreateDialogClose}
        onCreated={handlePointCreated}
        prefillLocation={clickedLocation}
      />

      <CustomRadiusDialog
        isOpen={isCustomRadiusDialogOpen}
        onClose={handleCustomRadiusClose}
        onConfirm={handleCustomRadiusConfirm}
      />
    </Layout>
  )
}
