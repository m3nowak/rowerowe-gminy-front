export interface Geometry {
  type: string;
  coordinates: any[];
}

export interface Feature {
  type: string;
  geometry: Geometry;
  properties: any;
}

export interface FeatureCollection {
  type: string;
  name: string;
  features: Feature[];
  crs: any;
}
