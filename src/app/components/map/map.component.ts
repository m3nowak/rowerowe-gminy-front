import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

//https://www.digitalocean.com/community/tutorials/angular-angular-and-leaflet

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit{
  private map!: L.Map;

  private initMap(): void {
    this.map = L.map('map', {
      center: [ 52.11433333, 19.42366667 ],
      zoom: 7
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }
  
  ngAfterViewInit(): void {
    this.initMap();
  }
}
