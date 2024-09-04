import { Routes } from '@angular/router';
import { MapLibreComponent } from './components/map-libre/map-libre.component';
import { MapUiComponent } from './components/map-ui/map-ui.component';

export const routes: Routes = [
    // { path: 'leaflet', component: MapComponent },
    { path: '', component: MapUiComponent}
];
