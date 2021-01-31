import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IEndFlight, IpcService, ITrackingData, flightStatus } from './ipc.service'
import { AirportsService } from './airports.service';
import { first } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';
import { IPlaneType, PlanesService } from './planes.service';
import { PilotService } from './pilot.service';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlightProgressService {

  private _depatureIcao: string;

  set depatureIcao(icao: string) {
    this._depatureIcao = icao;
    this._getDepatureData(icao);
  }
  get depatureIcao(): string {
    return this._depatureIcao;
  }
  depatureLat: number | undefined;
  depatureLong: number | undefined;

  flightNumber: string;
  isRegisterd = false;

  totalDistanceFlown = 0;

  get tripDistance(): number {
    if (this.arrivalLong && this.arrivalLat && this.depatureLong && this.depatureLat) {
      return this._getDistanceFromLatLonInKm(
        this.depatureLat,
        this.depatureLong,
        this.arrivalLat,
        this.arrivalLong
      ) / 1.852;
    } else {
      return 0;
    }
  }

  private _arrivalIcao: string;
  set arrivalIcao(icao: string) {
    this._arrivalIcao = icao;
    console.log('arrival', icao);
    this._getArrivalData(icao);
  }


  get arrivalIcao(): string {
    return this._arrivalIcao;
  }

  /**
   * Gets the remaining distance in NM
   */
  get distanceRemaining(): number {
    if (this.currentData?.getValue() && this.arrivalLong && this.arrivalLat) {
      const data = this.currentData.getValue();
      return this._getDistanceFromLatLonInKm(
        data.latitude,
        data.longitude,
        this.arrivalLat,
        this.arrivalLong
      ) / 1.852;
    } else {
      return 0;
    }
  }

  /**
   * Gets the remaining flight time in hours
   */
  get timeRemaining(): number {
    if (this.currentData?.getValue()) {
      const groundSpeed = this.currentData.getValue().gs;
      const timeRemaining = this.distanceRemaining / groundSpeed;
      return timeRemaining;
    }
    return 0;
  }

  arrivalLat: number | undefined;
  arrivalLong: number | undefined;
  currentData: BehaviorSubject<ITrackingData>;

  flightStatus = new BehaviorSubject<flightStatus>(flightStatus.preDepature);

  dataSub: undefined | Subscription;

  isScheduled = false;

  private _prevLat: number;
  private _prevLong: number;

  cargo: number;
  pax: number;

  constructor(
    private readonly _ipc: IpcService,
    private readonly _airports: AirportsService,
    private readonly socket: Socket,
    private readonly _planesService: PlanesService,
    private readonly _pilotService: PilotService,
    private readonly _http: HttpClient
  ) {
    this.currentData = this._ipc.currentData;
    this.dataSub = this._ipc.currentData.subscribe((data) => {
      if (data && this.isRegisterd) {
        const posRep: IPositionReport = {
          altitude: data.altitude,
          flightNumber: this.flightNumber,
          gs: data.gs,
          lat: data.latitude,
          long: data.longitude,
          heading: data.heading,
        }
        this.socket.emit('trackingData', posRep)

        if (this._prevLat && this._prevLong) {
          const distanceFlown = this._getDistanceFromLatLonInKm(this._prevLat, this._prevLong, data.latitude, data.longitude) / 1.852;
          this.totalDistanceFlown += distanceFlown;
        }
      }
    })
    this._ipc.endFlightEvent.subscribe((data) => {
      this.endFlight(data);
    })
  }

  async endFlight(data: IEndFlight) {
    const duration = (data.end.valueOf() - data.start.valueOf()) / 1000;
    const body: CreateFinishedFlightDto = {
      arrivalIcao: this.arrivalIcao,
      depatureIcao: this.depatureIcao,
      cargo: this.cargo,
      distance: this.totalDistanceFlown,
      duration: duration,
      pax: this.pax,
      pilotId: this._pilotService.currentPilot.getValue().pilotId,
      planeTypeCode: (await this._planesService.getPlaneByAtcTypeCode(data.data.atcTypeCode).toPromise()).plane.typeCode || 'unk',
    }
    await this._http.post(`${AppConfig.apiUrl}/finished-flights`, body).toPromise();
  }

  private _getDepatureData(icao: string): void {
    this._airports.getAirport(icao).pipe(first()).subscribe((data) => {
      this.depatureLat = data.lat;
      this.depatureLong = data.long;
    })
  }

  private _getArrivalData(icao: string): void {
    this._airports.getAirport(icao).pipe(first()).subscribe((data) => {
      this.arrivalLat = data.lat;
      this.arrivalLong = data.long;
    })
  }

  private _getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this._deg2rad(lat2 - lat1);  // this._deg2rad below
    var dLon = this._deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this._deg2rad(lat1)) * Math.cos(this._deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  private _deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  async registerFlight(depatureIcao: string, arrivalIcao: string, flightNumber: string, isScheduled = false): Promise<void> {
    this.totalDistanceFlown = 0;
    if (!(this.currentData.getValue())) {
      throw new Error('No tracking data');
    }
    this.flightNumber = flightNumber;
    this.arrivalIcao = arrivalIcao;
    this.depatureIcao = depatureIcao,
      this.isScheduled = isScheduled;
    const data = this.currentData.getValue();

    // Get Plane type from backend
    let planeType = (await this._planesService.getPlaneByAtcTypeCode(data.atcTypeCode).toPromise()).plane;
    if (!planeType) {
      planeType = {
        atcTypeCodes: null,
        description: 'Unknown',
        typeCode: 'unk',
      };
    }

    const flightData: CreateFlightDto = {
      lat: data.latitude,
      long: data.longitude,
      flightNumber: this.flightNumber,
      arrivalIcao: this._arrivalIcao,
      depatureIcao: this._depatureIcao,
      planeType,
      isScheduled,
      ...this.currentData.getValue()
    }

    // Send registration
    console.log('Sending registration');
    this.socket.emit('createFlight', flightData);
    const response = await this.socket.fromOneTimeEvent<IRegistrationResponse>('createFlight');
    if (response.success) {
      this.isRegisterd = true;
      return;
    } else {
      throw new Error(response.message);
    }
  }
}


export interface IPositionReport {
  flightNumber: string;
  lat: number;
  long: number;
  altitude: number;
  gs: number;
  heading: number;
}

export class CreateFlightDto {
  lat: number;
  long: number;
  flightNumber: string;
  gs: number;
  heading: number;
  altitude: number;
  depatureIcao: string;
  arrivalIcao: string;
  isScheduled: boolean;
  planeType: IPlaneType | string;
}

export interface IRegistrationResponse {
  success: boolean;
  message: string;
}

export class CreateFinishedFlightDto {
  depatureIcao: string;
  arrivalIcao: string;
  duration: number;
  distance: number;
  pax: number;
  cargo: number;
  pilotId: number;
  planeTypeCode: string;
}

