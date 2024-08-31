export interface Geometry {
    type: string;
    coordinates: Array<any>;
}

export interface Feature {
    type: string;
    geometry: Geometry;
    properties: any;
}

export interface FeatureCollection {
    type: string;
    name: string;
    features: Array<Feature>;
    crs: any;
}