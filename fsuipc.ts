import { FsuipcApi } from '@fsuipc/api';
import { Observable } from 'rxjs';
import { first, take } from 'rxjs/operators';
import * as config from './config.json';
import * as airports from './airports.json'


export class FSUIPCInterface {

  private _api;

  flightTrackingObs: Observable<any>;


  constructor() {
    this._api = new FsuipcApi();
  }

  async connectToSim(): Promise<void> {
    await this._api.init()
    this.flightTrackingObs = this._api.listen(3000, fsuipcStrings)
    console.log('Connected to sim');
    return;
  }

  async canStartFlight(icao: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {

      await this.connectToSim();
      console.log('Getting current info');
      const currentInfo = this.flightTrackingObs.pipe(first()).subscribe((currentInfo) => {
        console.log('CurrentInfo', currentInfo);

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

        if (currentInfo.gs > config.allowedSpeed) {
          console.error('To fast')
          reject('Too fast');
          return;
        }

        // Check distance
        const distance = this._getDistanceFromLatLonInKm(airport.lat, airport.long, currentInfo.latitude, currentInfo.longitude);
        if (distance > config.allowedDistance) {
          reject('Too far');
          return;
        }

        //Check engines running
        if (currentInfo.engine1Firing || currentInfo.engine2Firing || currentInfo.engine3Firing || currentInfo.engine4Firing) {
          console.error('Engine(s) running');
          reject(false);
          return;
        }

        resolve(true);
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
}