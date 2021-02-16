import { FsuipcApi } from '@flusinerd/msfs-api';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, takeUntil, takeWhile } from 'rxjs/operators';
import * as config from './config.json';
import * as axios from 'axios'
import { ipcMain, BrowserWindow } from "electron";
import { ITrackingData } from './trackingData.interface'
import { flightStatus } from './flightStatus';
import * as fs from 'fs';
import { join } from 'path';
const lineByLine = require('n-readlines');


export class FSUIPCInterface {

  private _api: FsuipcApi;

  flightStatus = new BehaviorSubject<flightStatus>(flightStatus.preDepature);

  flightTrackingObs = new BehaviorSubject<ITrackingData>(null);
  private _connectTimer;

  private _lastVsReadings = [];

  private _startDate: Date;
  private _endDate: Date;

  private fileHandle: fs.WriteStream;

  private type: string;
  private flightNumber: string;
  private origin: string;
  private destination: string;
  private cargo: number;
  private pax: number;
  private loggingFilePath = join(__dirname, 'flight.acars');
  private didCrash = false;
  private recoveryInterval;

  connectionObs = new BehaviorSubject<boolean>(false);

  constructor(private win: BrowserWindow) {
  }

  init(): void {
    this._api = new FsuipcApi();
    console.log('Trying to connect....');
    this.connectToSim();

    this.flightStatus.subscribe((status) => {
      this.win.webContents.send('flightStatus', status);
    })
  }

  async connectToSim(): Promise<void> {
    this._connectTimer = setInterval(async () => {
      try {
        await this._api.init();
        this.connectionObs.next(true);

        this._api.listen(3000, fsuipcStrings, true).subscribe(
          {
            complete: () => this.flightTrackingObs.complete(),
            error: x => { console.error('error', x); this.handleFSUIPCError(x)},
            next: x => this.flightTrackingObs.next(x)
          }
        )
        const isCrashed = await this.checkForCrash();

        if (isCrashed) {
          // Do stuff to handle crash
          this.handleCrash();
        }

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
    console.log('Subsribing to tracking');
    this.flightTrackingObs.subscribe(async (data) => {

      if (!data) {
        return;
      }

      const currentStatus = this.flightStatus.getValue();

      // Enable to log positions as well
      // if (currentStatus !== flightStatus.preDepature && currentStatus !== flightStatus.parked) {
      //   this.fileHandle.write(this._positionToString(data) + '\n');
      // }

      if (this.didCrash && !this.fileHandle) {
        this.fileHandle = fs.createWriteStream(this.loggingFilePath, {
          flags: 'a'
        });
      }

      // Switch for changing flightStatus based on current status
      switch (currentStatus) {
        case flightStatus.preDepature:
          if (data.engine1Firing) {
            this.flightStatus.next(flightStatus.taxiOut);
            console.log('Flight now in taxiOut')
            this._startDate = new Date();


            // Check if file already exists
            try {
              const fileExists = await fs.promises.access(this.loggingFilePath, fs.constants.F_OK);
              await fs.promises.unlink(this.loggingFilePath);
            } catch (error) {
            }

            // File is deleted, create a new one
            if (!this.didCrash) {
              this.fileHandle = fs.createWriteStream(this.loggingFilePath);
            }

            this.fileHandle.write(this.type + '\n');
            this.fileHandle.write(this.flightNumber + '\n');
            this.fileHandle.write(this._startDate.valueOf() + '\n');
            this.fileHandle.write(this.origin + '\n');
            this.fileHandle.write(this.destination + '\n');
            this.fileHandle.write(this.cargo + '\n');
            this.fileHandle.write(this.pax + '\n');
            this.fileHandle.write(this._statusToString(flightStatus.taxiOut) + '\n');
            // this.fileHandle.write(this._positionToString(data) + '\n');
          }
          break;

        case flightStatus.taxiOut:
          if (data.gs > 80) {
            this.flightStatus.next(flightStatus.depature);
            this.fileHandle.write(this._statusToString(flightStatus.depature) + '\n');
            console.log('Flight now in depature')
          }
          break;

        case flightStatus.depature:
          if (data.radioAlt > 2000) {
            this.flightStatus.next(flightStatus.climb);
            this.fileHandle.write(this._statusToString(flightStatus.climb) + '\n');
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
            this.fileHandle.write(this._statusToString(flightStatus.levelFlight) + '\n');
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
          if (average2 < -500) {
            this.flightStatus.next(flightStatus.descent);
            this.fileHandle.write(this._statusToString(flightStatus.descent) + '\n');
            console.log('Flight now in descent')
          }
          if (average2 > 500) {
            this.flightStatus.next(flightStatus.climb);
            this.fileHandle.write(this._statusToString(flightStatus.climb) + '\n');
            console.log('Flight now in descent')
          }
          break;

        case flightStatus.descent:
          this._lastVsReadings.push(data.vs);
          if (this._lastVsReadings.length > 20) {
            this._lastVsReadings.shift();
          }
          let sum4 = 0;
          for (const vs of this._lastVsReadings) {
            sum4 += vs;
          }
          const average4 = sum4 / this._lastVsReadings.length
          if (average4 > -200 && average4 < 200) {
            this.flightStatus.next(flightStatus.levelFlight);
            this.fileHandle.write(this._statusToString(flightStatus.levelFlight) + '\n');
            console.log('Flight now in levelFlight')
          }

          if (data.altitude < 10000) {
            this.flightStatus.next(flightStatus.approach);
            this.fileHandle.write(this._statusToString(flightStatus.approach) + '\n');
            console.log('Flight now in Approach')
          }
          break;

        case flightStatus.approach:
          if (data.radioAlt < 2500) {
            this.flightStatus.next(flightStatus.landing);
            this.fileHandle.write(this._statusToString(flightStatus.landing) + '\n');
          }
          break;

        case flightStatus.landing:
          if (data.planeOnground) {
            this.flightStatus.next(flightStatus.taxiToParking);
            this.fileHandle.write(this._statusToString(flightStatus.taxiToParking) + '\n');
            console.log('Taxi to parking')
            console.log('Touchdown VS', data.vsAtTouchdown);
          }
          if (data.vs > 1200) {
            this.flightStatus.next(flightStatus.goAround);
            this.fileHandle.write(this._statusToString(flightStatus.goAround) + '\n');
            console.log('Flight now in Go Around');
          }
          break;

        case flightStatus.taxiToParking:
          if (!data.engine1Firing) {
            this.flightStatus.next(flightStatus.parked);
            this.fileHandle.write(this._statusToString(flightStatus.parked) + '\n');
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
            this.fileHandle.write(this._statusToString(flightStatus.landing) + '\n');
            console.log('Flight now in landing');
          }
          break;
      }

    });
  }

  async handleFSUIPCError(error: any) {
    console.log(error);
    // Error code 12 on disconnect
    if (error.code === 12) {
      // Disconected 
      this.connectionObs.next(false);
      this.connectToSim();
    }
  }

  async canStartFreeFlight(type: string, flightNo: string, origin: string, destination: string, cargo: number, pax: number): Promise<ITrackingData> {
    return new Promise(async (resolve, reject) => {
      if (!this.connectionObs.getValue()) {
        console.log('No connection to sim');
        reject('No connection to Sim')
        return;
      }

      this.type = type;
      this.flightNumber = flightNo;
      this.origin = origin;
      this.destination = destination;
      this.cargo = cargo;
      this.pax = pax;


      this._subscribeToTrackingObs();

      this.flightTrackingObs.pipe(first()).subscribe((currentInfo) => {

        console.log('Current info', currentInfo);

        if (currentInfo.gs > config.allowedSpeed) {
          reject('Too fast');
          return;
        }

        // if (currentInfo.engine1Firing) {
        //   console.error('Engine(s) running');
        //   reject(false);
        //   return;
        // }

        resolve(currentInfo);
      })
    })
  }

  async canStartFlight(type: string, flightNo: string, origin: string, destination: string, cargo: number, pax: number): Promise<ITrackingData> {
    return new Promise(async (resolve, reject) => {
      this.flightTrackingObs.pipe(first()).subscribe(async (currentInfo) => {

        // Check if he can start free flight
        try {
          await this.canStartFreeFlight(type, flightNo, origin, destination, cargo, pax);
        } catch (error) {
          console.error(error);
          reject(error);
          return;
        }

        const depatureAirport = (await axios.default.get<IAirportData>(`${config.apiUrl}/airports/${origin.toLowerCase()}`)).data;

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

  private _positionToString(data: ITrackingData) {
    let positionString = `${data.latitude};${data.longitude};${data.altitude}`;
    return positionString;
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

  async onEndFlight(data: ITrackingData) {
    console.log('Ending flight');
    this._endDate = new Date();
    this.win.webContents.send('endFlight', data, this._startDate, this._endDate);
    console.log('Ending flight with', data, this._startDate, this._endDate);

    // Delete localLoggin file
    this.fileHandle.close();
    await fs.promises.unlink(this.loggingFilePath);
  }

  private _statusToString(flightStatus: flightStatus) {
    return `flightStatus;${flightStatus}`;
  }

  private _parseLine(line: string): parseResult {

    console.log('Test', 'Level Flight' as flightStatus)
    if (line.length === 0) {
      return {
        type: parseResultType.emptyLine,
        value: undefined
      }
    }
    // Check if its a flightStatus or not
    if (line.includes('flightStatus')) {
      // Is Flight status. Split at ;
      const value = line.split(';')[1];
      let returnValue = flightStatus.preDepature;
      if (value === 'Taxi Out') {
        returnValue = flightStatus.taxiOut;
      } else if (value === 'Depature') {
        returnValue = flightStatus.depature;
      } else if (value === 'Climb') {
        returnValue = flightStatus.climb;
      } else if (value === 'Level Flight') {
        returnValue = flightStatus.levelFlight;
      } else if (value === 'Descent') {
        returnValue = flightStatus.descent;
      } else if (value === 'Approach') {
        returnValue = flightStatus.approach;
      } else if (value === 'Landing') {
        returnValue = flightStatus.landing;
      } else if (value === 'Parked') {
        returnValue = flightStatus.parked;
      } else if (value === 'Taxi To Parking') {
        returnValue = flightStatus.taxiToParking;
      } else if (value === 'Go Around') {
        returnValue = flightStatus.goAround;
      }
      return {
        type: parseResultType.flightStatus,
        value: returnValue
      }
    } else {
      // Is position split at ; multiple times
      const splits = line.split(';')
      const lat = +splits[0];
      const long = +splits[1];
      const altitude = +splits[2];
      return {
        type: parseResultType.postition,
        value: {
          altitude,
          lat,
          long
        }
      }
    }
  }

  private async checkForCrash(): Promise<boolean> {
    let isCrashed = true;
    try {
      await fs.promises.access(this.loggingFilePath, fs.constants.F_OK);
      isCrashed = true;
    } catch (error) {
      isCrashed = false;
    }
    return isCrashed;
  }

  // ACARS did crash. Send crash event to the client and resume the tracking
  private async handleCrash() {

    console.log('Handling crash');
    // Create Read Stream
    const liner = new lineByLine(this.loggingFilePath);
    this.type = liner.next().toString();
    this.flightNumber = liner.next().toString();
    this._startDate = new Date(+liner.next().toString());
    this.origin = liner.next().toString();
    this.destination = liner.next().toString();
    this.cargo = liner.next().toString();
    this.pax = liner.next().toString();
    // Read the rest of the file
    let line;
    while (line = liner.next()) {
      line = line.toString();
      const result = await this._parseLine(line.toString());

      if (result.type === parseResultType.flightStatus) {
        this.flightStatus.next(result.value as flightStatus);
      }
    }

    console.log('Crash handled, status now', this.flightStatus.getValue())
    this.didCrash = true;

    this.recoveryInterval = setInterval(this._checkRecovery.bind(this), 500);
  }

  private async _checkRecovery() {
    const connected = await this.connectionObs.getValue();
    if (connected) {
      this._subscribeToTrackingObs();
      clearInterval(this.recoveryInterval);
      console.log('Flight recovered');
      setTimeout(this._sendRecovery.bind(this), 10000);
    }
  }

  private _sendRecovery() {
    this.win.webContents.send('recovery', this.origin, this.destination, this.cargo, this.pax);
    this.win.webContents.send('flightStatus', this.flightStatus.getValue());
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
  'landingLights',
  'aircraftName',
]

export interface IAirportData {
  icao: string;
  lat: string;
  long: string;
}

interface parseResult {
  type: parseResultType,
  value: parseResultValuePosition | flightStatus | undefined
}

interface parseResultValuePosition {
  lat: number;
  long: number;
  altitude: number;
}

enum parseResultType {
  flightStatus,
  postition,
  emptyLine
}
