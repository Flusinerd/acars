import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CircleMarker, circleMarker, icon, latLng, LatLngExpression, Marker, marker, point, Point, Polyline, polyline, tileLayer } from 'leaflet';
import 'leaflet-rotatedmarker';
import { Subscription, timer } from 'rxjs';
import { AirportsService, IAirport } from '../airports.service';
import { IpcService } from '../ipc.service';
import { Flight, TrackingService } from '../tracking.service';

@Component({
  selector: 'app-live-map',
  templateUrl: './live-map.component.html',
  styleUrls: ['./live-map.component.scss']
})
export class LiveMapComponent implements OnInit, OnDestroy {

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

  flights: Flight[] = [];

  flightData: undefined | IFlightData = undefined;

  private _airportsSub: Subscription | undefined = undefined;

  layers: any[] = [];

  private _timerSub: Subscription | undefined;

  constructor(
    private _ipc: IpcService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _airportService: AirportsService,
    private _trackingService: TrackingService,
  ) { }

  ngOnDestroy(): void {
    this._timerSub?.unsubscribe();
    this._airportsSub?.unsubscribe();
  }

  ngOnInit(): void {
    this._timerSub = timer(0, 5000).subscribe(async () => {
      const flights = await this._trackingService.getFlights().toPromise();
      this._updateMap(flights);
    })



    this._airportsSub = this._airportService.airports.subscribe((airports) => {
      if (airports.length < 6000) {
        return;
      }
      for (const airport of airports) {
        this._drawAirport(airport);
      }
      this._changeDetectorRef.detectChanges();
    })
  }

  private _updateMap(flights: Flight[]) {
    for (const flight of flights) {
      let foundFlight = this._findFlight(flight.flightNumber);
      if (foundFlight) {
        // Flight found update data
        const index = this.flights.findIndex((candidate) => candidate.flightNumber === foundFlight.flightNumber);
        this.flights[index] = flight;
        this._updateFlight(flight);
      } else {
        this._initFlight(flight);
      }
    }
    this._changeDetectorRef.detectChanges();
  }

  private _findFlight(flightNo: string): Flight {
    const res = this.flights.find((candidate) => candidate.flightNumber === flightNo);
    return res;
  }

  private _drawAirport(airport: IAirport) {
    const markerExists = this._getAirportMarker(airport);
    let marker: CircleMarker;
    if (!markerExists) {
        marker = circleMarker([airport.lat, airport.long], {
          color: '#d4641c',
          radius: 2,
        }).bindTooltip(airport.icao, {direction: 'right'});
  
      const options = marker.options as any;
      options.icao = airport.icao;
    } else {
      marker = markerExists;
      marker.setLatLng([airport.lat, airport.long]);
    }

    this.layers.push(marker);
  }

  private _getAirportMarker(airport: IAirport): CircleMarker | undefined {
    return this.layers.find((marker) => marker.options.icao === airport.icao && marker instanceof CircleMarker);
  }

  private _initFlight(flightData: Flight) {
    if (this._checkIfFlightExists(flightData.flightNumber)) {
      return;
    }

    this.layers.push(this.createFlightMarker(flightData));
    this.flights.push(flightData);
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
    const data = this._findFlight(flightData.flightNumber);
    const line = polyline([
      [data.positions[0].lat, data.positions[0].long]
    ], { color: '#944615' })
    for (let i = 1; i < data.positions.length; i++) {
      line.addLatLng([data.positions[i].lat, data.positions[i].long]);
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
