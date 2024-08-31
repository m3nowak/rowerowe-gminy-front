import { FeatureCollection } from 'geojson';

export interface NamedFeatureCollection{
    name: string;
    features: FeatureCollection;
}