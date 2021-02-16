import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { AppConfig } from '../environments/environment'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AirportsService {

  airports = new BehaviorSubject<IAirport[]>([]);

  constructor(
    private _http: HttpClient
  ) { }

  async getAirports(take = 100, skip = 0): Promise<IAirport[]> {
    return this._http.get<IAirport[]>(`${AppConfig.apiUrl}/airports?take=${take}&skip=${skip}`)
    .pipe(map((response) => {
      const airports = response.map((airport) => { airport.ident = airport.ident.toUpperCase(); return airport })

      const currentAirports = this.airports.getValue();
      for(const airport of airports) {
        let foundAirport = currentAirports.find((foundPort) => airport.ident === foundPort.ident);
        if (foundAirport) {
          foundAirport = airport;
        } else {
          currentAirports.push(airport);
        }
      }

      this.airports.next(currentAirports);
      return airports;
    }))
    .toPromise();
  }

  getAirport(icao: string){
    return this._http.get<IAirport>(`${AppConfig.apiUrl}/airports/${icao}`);
  }
}

export interface IAirport {
  ident: string;
  latitude_deg: number;
  longitude_deg: number;
}