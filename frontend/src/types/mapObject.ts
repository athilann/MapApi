export interface MapObjectResponse {
  id: string;
  name: string;
  description: string;
  longitude: number;
  latitude: number;
}

export interface CreateMapObjectRequest {
  name: string;
  description: string;
  longitude: number;
  latitude: number;
}

export interface GetMapObjectsInAreaRequest {
  longitude: number;
  latitude: number;
  radiusInMeters: number;
}
