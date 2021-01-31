import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PilotService {

  currentPilot = new BehaviorSubject<Pilot>(null);

  constructor(
    private _http: HttpClient,
  ) {
    this.getPilot('1');
  }

  getPilot(id: string) {
    return this._http.get<Pilot>(`${AppConfig.apiUrl}/pilots/${id}`);
  }

  login(email: string, password: string) {

  }
}

export interface Pilot {
  currentLocation: string;
  email: string;
  firstName: string;
  flightHours: number;
  name: string;
  pilotId: number;
  totalDistance: number;
  totalFlights: number;
  totalPax: number;
}