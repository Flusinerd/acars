import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../environments/environment';
import { map } from 'rxjs/operators';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class PilotService {

  currentPilot = new BehaviorSubject<Pilot>(null);

  private _accessToken: string;
  get accessToken(): string {
    return this._accessToken
  }

  get isLoggedIn(): boolean {
    return !!this._accessToken
  }


  constructor(
    private _http: HttpClient,
  ) {
    this.getPilot('1');
  }

  getPilot(id: string) {
    return this._http.get<Pilot>(`${AppConfig.apiUrl}/pilots/${id}`);
  }

  login(email: string, password: string): Observable<{access_token: string}> {
    return this._http.post<{access_token: string}>(`${AppConfig.apiUrl}/pilots/auth/login`, {email, password})
    .pipe(map((response) => {
      this._accessToken = response.access_token;
      this.currentPilot.next(jwt_decode(this._accessToken))
      console.log(this.currentPilot.getValue());
      return response;
    }))
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
  rank: Rank
}

export interface TokenData extends Pilot {
  exp: Date;
  iat: Date;
}

export enum Rank {
  STUDENT = "Student Pilot",
  PRIVATE_PILOT = "Private Pilot",
  SECOND_OFFICER = "Second Officer",
  JUNIOR_FIRST_OFFICER = "Junior First Officer",
  FIRST_OFFICER = "First Officer",
  SENIOR_FIRST_OFFICER = "Senior First Officer",
  CAPTAIN = "Captain",
  FLIGHT_CAPTAIN = "Flight Captain",
  SENIOR_CAPTAIN = "Senior Captain",
  VA_TRANSPORT_PILOT = "VA Transport Pilot",
}