import { FsuipcApi } from '@flusinerd/msfs-api';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import * as config from './config.json';
import * as axios from 'axios'
import { ipcMain } from "electron";



export class FSUIPCInterface {

  private _api;

  flightStatus = new BehaviorSubject<flightStatus>(flightStatus.preDepature);

  flightTrackingObs: Observable<ITrackingData>;
  private _connectTimer;

  private _startLocationLat;
  private _startLocationLong;

  private _lastVsReadings = [];

  private _startDate;
  private _endDate;

  connectionObs = new BehaviorSubject<boolean>(false);

  constructor() {
    this._api = new FsuipcApi();
    console.log('Trying to connect....');
    this.connectToSim();

    this.flightStatus.subscribe((status) => {
      ipcMain.emit('flightStatus', status);
    })
  }

  async connectToSim(): Promise<void> {
    this._connectTimer = setInterval(async () => {
      try {
        await this._api.init();
        console.log('trying to connect to sim...');
        this.connectionObs.next(true);

        console.log('PRe')
        this.flightTrackingObs = this._api.listen(3000, fsuipcStrings, true)
        console.log('Obs set')
        this._subscribeToTrackingObs();

        console.log('Connected to sim');
        clearInterval(this._connectTimer);
      } catch (error) {
        if (error.code === 2 && this.connectionObs.getValue() === true) {
          this.connectionObs.next(false);
          console.log('Not connected');
        } 
      }
    }, 2000);
  }

  private _subscribeToTrackingObs(): void {
    this.flightTrackingObs.subscribe((data) => {

      console.log(data);

      const currentStatus = this.flightStatus.getValue();
      if (currentStatus === flightStatus.preDepature) {
        if (data.engine1Firing) {
          this.flightStatus.next(flightStatus.depature);
          this._startDate = new Date();
          console.log('Flight now in depature')
        }
      } else if (currentStatus === flightStatus.depature) {
        if (this._getDistanceFromLatLonInKm(this._startLocationLat, this._startLocationLong, data.latitude, data.longitude) > 10) {
          this.flightStatus.next(flightStatus.enroute);
          console.log('Flight now enroute')
        }
      } else if (currentStatus === flightStatus.enroute) {
        this._lastVsReadings.push(data.vs)
        if (this._lastVsReadings.length > 20) {
          this._lastVsReadings.shift();
        }
        let sum = 0;
        for (const vs of this._lastVsReadings) {
          sum += vs;
        }
        const average = sum / this._lastVsReadings.length
        if (average < -600) {
          this.flightStatus.next(flightStatus.approach);
          console.log('Flight now in approach')
        }
      }
      else if (currentStatus === flightStatus.approach) {
        if ((data.altitude - data.nearestAirportAltitude) < 2000) {
          this.flightStatus.next(flightStatus.landing);
          console.log('Flight now landing')
        }
      }
      else if (currentStatus === flightStatus.landing) {
        if (data.planeOnground) {
          this.flightStatus.next(flightStatus.taxiToParking);
          console.log('Taxi to parking')
          console.log('Touchdown VS', data.vsAtTouchdown);
        }
      } else if( currentStatus === flightStatus.taxiToParking) {
        if (!data.engine1Firing) {
            this.flightStatus.next(flightStatus.parked);
            console.log('Flight now parked');
            this.onEndFlight(data);
          }
      }

    }, (error) => {
      // Error code 12 on disconnect
      if (error.code === 12) {
        // Disconected 
        this.connectionObs.next(false);
        this.connectToSim();
      }
    })
  }


  async canStartFreeFlight(): Promise<ITrackingData> {
    return new Promise(async (resolve, reject) => {
      if (!this.connectionObs.getValue()) {
        console.log('No connection to sim');
        reject('No connection to Sim')
        return;
      }

      console.log("Obs", this.flightTrackingObs);

      this.flightTrackingObs.pipe(first()).subscribe((currentInfo) => {

        console.log('Current info', currentInfo);

        this._startLocationLat = currentInfo.latitude;
        this._startLocationLong = currentInfo.longitude;

        if (currentInfo.gs > config.allowedSpeed) {
          reject('Too fast');
          return;
        }

        if (currentInfo.engine1Firing) {
          console.error('Engine(s) running');
          reject(false);
          return;
        }

        resolve(currentInfo);
      })
    })
  }

  async canStartFlight(icao: string): Promise<ITrackingData> {
    return new Promise(async (resolve, reject) => {
      this.flightTrackingObs.pipe(first()).subscribe(async (currentInfo) => {

        // Check if he can start free flight
        try {
          await this.canStartFreeFlight();
        } catch (error) {
          console.error(error);
          reject(error);
          return;
        }

        const depatureAirport = (await axios.default.get<IAirportData>(`${config.apiUrl}/airports/${icao.toLowerCase()}`)).data;

        if (!depatureAirport) {
          reject('Depature Airport not found');
          return;
        }


        // Check distance
        const distance = this._getDistanceFromLatLonInKm(depatureAirport.lat, depatureAirport.long, currentInfo.latitude, currentInfo.longitude);
        if (distance > config.allowedDistance) {
          reject('Too far');
          return;
        }
        resolve(currentInfo);
      })
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

  onEndFlight(data: ITrackingData): void{
    this._endDate = new Date();
    ipcMain.emit('endFlight', data, this._startDate, this._endDate);
  }
}

const fsuipcStrings = [
  'gs',
  'latitude',
  'longitude',
  'altitude',
  'ias',
  'vs',
  'heading',
  'engine1Firing',
  'nearestAirportAltitude',
  'atcTypeCode',
  'vsAtTouchdown',
  'planeOnground'
]
export interface ITrackingData {
  gs: number;
  ias: number;
  vs: number;
  altitude: number;
  longitude: number;
  latitude: number;
  heading: number;
  engine1Firing: boolean;
  nearestAirportAltitude: number;
  atcTypeCode: string;
  vsAtTouchdown: number;
  planeOnground: boolean;
}

export interface IAirportData {
  icao: string;
  lat: string;
  long: string;
}

export enum flightStatus {
  preDepature,
  depature,
  enroute,
  approach,
  landing,
  parked,
  taxiToParking
}