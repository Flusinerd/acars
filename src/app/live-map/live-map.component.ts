import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { icon, latLng, LatLngExpression, Marker, marker, Point, Polyline, polyline, tileLayer } from 'leaflet';
import 'leaflet-rotatedmarker';
import { IpcService } from '../ipc.service';

@Component({
  selector: 'app-live-map',
  templateUrl: './live-map.component.html',
  styleUrls: ['./live-map.component.scss']
})
export class LiveMapComponent implements OnInit {

  planeIcon = icon({
    iconUrl: 'assets/icons/plane.svg',
    iconSize: [25, 25],
  })

  options = {
    layers: [
      tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 5,
    center: latLng(51.28950119, 6.7667798999999995)
  };

  flightData: undefined | IFlightData = undefined;

  layers: any[] = [];

  constructor(
    private _ipc: IpcService,
    private _changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this._ipc.currentData.subscribe((data) => {
      if (data) {
        if (!this.flightData) {
          this.flightData = {
            flightNumber: 'MQT1922',
            heading: data.heading,
            positions: [{
              lat: data.latitude,
              long: data.longitude
            }]
          }
          this._initFlight(this.flightData);
        } else {
          // Flight already exists, append position data and update heading
          this.flightData.positions.push({
            lat: data.latitude,
            long: data.longitude,
          })
          this.flightData.heading = data.heading;
          this._updateFlight(this.flightData);
        }
      }
    })
  }

  private _initFlight(flightData: IFlightData) {
    if (this._checkIfFlightExists(flightData.flightNumber)) {
      return;
    }

    this.layers.push(this.createFlightMarker(flightData));
    this._changeDetectorRef.detectChanges();
  }

  private _updateFlight(flightData: IFlightData) {
    this._updateFlightMarker(flightData);
    this._updateFlightPath(flightData);
  }

  private _updateFlightMarker(flightData: IFlightData) {
    const marker = this._getFlightMarker(flightData.flightNumber);
    const latestPosition = flightData.positions[flightData.positions.length - 1];
    marker.setLatLng([
      latestPosition.lat,
      latestPosition.long
    ])
    marker.setRotationAngle(flightData.heading);
  }

  private _updateFlightPath(flightData: IFlightData) {
    const line = this._getFlightPath(flightData.flightNumber);
    if (!line) {
      // Line is not drawn yet
      return;
    }
    const latestPosition = flightData.positions[flightData.positions.length - 1];
    line.addLatLng([
      latestPosition.lat,
      latestPosition.long
    ]);
  }

  private _getFlightMarker(flightNo: string): Marker | undefined {
    return this.layers.find((marker) => marker instanceof Marker && this._getMarkerFlightNo(marker) === flightNo) as Marker;
  }

  private _getFlightPath(flightNo: string): Polyline | undefined {
    return this.layers.find((marker) => marker instanceof Polyline && this._getMarkerFlightNo(marker) === flightNo) as Polyline;
  }

  private createFlightMarker(flightData: IFlightData) {
    const mark = marker(
      [flightData.positions[0].lat, flightData.positions[0].long],
      {
        icon: this.planeIcon,
        rotationAngle: flightData.heading,
        rotationOrigin: 'center center',
      }
    ).bindTooltip(flightData.flightNumber, { permanent: true, className: 'flight-number', direction: 'right', offset: new Point(12, 0) })

    const options = mark.options as any;
    options.flightNumber = flightData.flightNumber;

    mark.on('click', () => {
      this._onMarkerClick(flightData)
    })

    return mark;
  }

  private _onMarkerClick(flightData: IFlightData): void {
    const line = this._getFlightPath(flightData.flightNumber);
    if (!line) {
      // Line not beeing drawn => Draw the line
      this.layers.push(this.createFlightPath(flightData));
    }
    this._changeDetectorRef.detectChanges();
  }

  private createFlightPath(flightData: IFlightData) {
    const line = polyline([
      [flightData.positions[0].lat, flightData.positions[0].long]
    ], { color: '#944615' })
    for (let i = 1; i < flightData.positions.length; i++) {
      line.addLatLng([flightData.positions[i].lat, flightData.positions[i].long]);
    }

    const options = line.options as any;
    options.flightNumber = flightData.flightNumber;
    return line;
  }

  private _checkIfFlightExists(flightNo: string) {
    return this._getFlightMarker(flightNo) ? true : false;
  }

  private _getMarkerFlightNo(marker: any): string {
    return marker.options.flightNumber;
  }

  onMapClick(): void {
    // Remove all polylines
    this.layers = this.layers.filter((marker: any) => !(marker instanceof Polyline));
  }

}

export interface IFlightData {
  positions: IPosition[];
  heading: number,
  flightNumber: string,
}

export interface IPosition {
  lat: number,
  long: number
}
