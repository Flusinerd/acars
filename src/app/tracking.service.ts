import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  constructor(private _http: HttpClient) { }

  getFlights() {
    return this._http.get<Flight[]>(`${AppConfig.apiUrl}/tracking/flights`);
  }
}

export interface Flight {
  positions: IPosition[];
  flightNumber: string;
  gs: number;
  heading: number;
  altitude: number;
  depatureIcao: string;
  arrivalIcao: string;
  isScheduled: boolean;
}

export interface IPosition {
  lat: number,
  long: number,
}
