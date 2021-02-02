import { FsuipcApi } from '@flusinerd/msfs-api';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import * as config from './config.json';
import * as axios from 'axios'
import { ipcMain, BrowserWindow } from "electron";
import { ITrackingData } from './trackingData.interface'
import { flightStatus } from './flightStatus';



export class FSUIPCInterface {

  private _api;

  flightStatus = new BehaviorSubject<flightStatus>(flightStatus.preDepature);

  flightTrackingObs: Observable<ITrackingData>;
  private _connectTimer;

  private _lastVsReadings = [];

  private _startDate;
  private _endDate;

  connectionObs = new BehaviorSubject<boolean>(false);

  constructor(private win: BrowserWindow) {
  }

  init(): void {
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

      if (!data) {
        return;
      }

      this.onEndFlight(data);

      const currentStatus = this.flightStatus.getValue();

      // Switch for changing flightStatus based on current status
      switch (currentStatus) {
        case flightStatus.preDepature:
          if (data.engine1Firing) {
            this.flightStatus.next(flightStatus.taxiOut);
            this._startDate = new Date();
            console.log('Flight now in taxiOut')
          }
          break;

        case flightStatus.taxiOut:
          if (data.gs > 80) {
            this.flightStatus.next(flightStatus.depature);
            console.log('Flight now in depature')
          }
          break;

        case flightStatus.depature:
          if (data.radioAlt > 2000) {
            this.flightStatus.next(flightStatus.climb);
            console.log('Flight now in climb')
          }
          break;

        case flightStatus.climb:
          this._lastVsReadings.push(data.vs);
          if (this._lastVsReadings.length > 20) {
            this._lastVsReadings.shift();
          }
          let sum = 0;
          for (const vs of this._lastVsReadings) {
            sum += vs;
          }
          const average = sum / this._lastVsReadings.length
          if (average < 600 && average > -600) {
            this.flightStatus.next(flightStatus.levelFlight);
            console.log('Flight now in level Flight')
          }
          break;

        case flightStatus.levelFlight:
          this._lastVsReadings.push(data.vs);
          if (this._lastVsReadings.length > 20) {
            this._lastVsReadings.shift();
          }
          let sum2 = 0;
          for (const vs of this._lastVsReadings) {
            sum2 += vs;
          }
          const average2 = sum2 / this._lastVsReadings.length
          if (average2 < -1200) {
            this.flightStatus.next(flightStatus.descent);
            console.log('Flight now in descent')
          }
          break;

        case flightStatus.descent:
          if (data.altitude < 10000) {
            this.flightStatus.next(flightStatus.approach);
            console.log('Flight now in Approach')
          }
          break;

        case flightStatus.approach:
          if (data.radioAlt < 2500) {
            this.flightStatus.next(flightStatus.landing);
          }
          break;

        case flightStatus.landing:
          if (data.planeOnground) {
            this.flightStatus.next(flightStatus.taxiToParking);
            console.log('Taxi to parking')
            console.log('Touchdown VS', data.vsAtTouchdown);
          }
          if (data.vs > 1200) {
            this.flightStatus.next(flightStatus.goAround);
            console.log('Flight now in Go Around');
          }
          break;

        case flightStatus.taxiToParking:
          if (!data.engine1Firing) {
            this.flightStatus.next(flightStatus.parked);
            console.log('Flight now parked');
            this.onEndFlight(data);
          }
          break;

        case flightStatus.goAround:
          this._lastVsReadings.push(data.vs);
          if (this._lastVsReadings.length > 20) {
            this._lastVsReadings.shift();
          }
          let sum3 = 0;
          for (const vs of this._lastVsReadings) {
            sum3 += vs;
          }
          const average3 = sum3 / this._lastVsReadings.length
          if (average3 < -800 && data.radioAlt < 2500) {
            this.flightStatus.next(flightStatus.landing);
            console.log('Flight now in landing');
          }
          break;
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

  onEndFlight(data: ITrackingData): void {
    console.log('Ending flight');
    this._endDate = new Date();
    this.win.webContents.send('endFlight', data, this._startDate, this._endDate);
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
  'planeOnground',
  'radioAlt',
  'flapsControl',
  'landingLights'
]

export interface IAirportData {
  icao: string;
  lat: string;
  long: string;
}
