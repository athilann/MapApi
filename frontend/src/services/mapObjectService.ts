import apiClient from './apiClient'
import type {
  MapObjectResponse,
  CreateMapObjectRequest,
} from '../types/mapObject'

export const getMapObjectsInArea = (
  longitude: number,
  latitude: number,
  radiusInMeters: number,
): Promise<MapObjectResponse[]> =>
  apiClient
    .get<MapObjectResponse[]>('/api/map-objects', {
      params: { longitude, latitude, radiusInMeters },
    })
    .then((res) => res.data)

export const getMapObjectById = (id: string): Promise<MapObjectResponse> =>
  apiClient
    .get<MapObjectResponse>(`/api/map-objects/${id}`)
    .then((res) => res.data)

export const createMapObject = (
  data: CreateMapObjectRequest,
): Promise<MapObjectResponse> =>
  apiClient
    .post<MapObjectResponse>('/api/map-objects', data)
    .then((res) => res.data)
