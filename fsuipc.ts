import { FsuipcApi } from '@fsuipc/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import * as config from './config.json';
import * as airports from './airports.json'


export class FSUIPCInterface {

  private _api;

  flightTrackingObs: Observable<ITrackingData>;
  private _connectTimer;

  connectionObs = new BehaviorSubject<boolean>(false);

  constructor() {
    this._api = new FsuipcApi();
    this.connectToSim();
  }

  async connectToSim(): Promise<void> {
    this._connectTimer = setInterval(async () => {
      try {
        await this._api.init();
        this.connectionObs.next(true);
        
        this.flightTrackingObs = this._api.listen(3000, fsuipcStrings, true)
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
    this.flightTrackingObs.subscribe(() => {}, (error) => {
      // Error code 12 on disconnect
      console.error(error);
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
        reject('No connection to Sim')
        return;
      }

      this.flightTrackingObs.pipe(first()).subscribe((currentInfo) => {

        if (currentInfo.gs > config.allowedSpeed) {
          reject('Too fast');
          return;
        }

        if (currentInfo.engine1Firing || currentInfo.engine2Firing || currentInfo.engine3Firing || currentInfo.engine4Firing) {
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

        
        const airport = airports[icao];
        if (!airport) {
          console.error('Cannot find airport', icao);
          reject('Cannot find airport');
          return;
        }

        if (Math.abs(currentInfo.altitude - airport.elevation) > config.allowedHeight) {
          console.error('To High')
          reject('Too High');
          return;
        }

        // Check distance
        const distance = this._getDistanceFromLatLonInKm(airport.lat, airport.long, currentInfo.latitude, currentInfo.longitude);
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
  'engine2Firing',
  'engine3Firing',
  'engine4Firing',

]
export interface ITrackingData {
  gs: number,
  ias: number,
  vs: number,
  altitude: number,
  longitude: number,
  latitude: number,
  heading: number,
  engine1Firing: boolean,
  engine2Firing: boolean,
  engine3Firing: boolean,
  engine4Firing: boolean,
}