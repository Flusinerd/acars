import { EventEmitter, Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class IpcService {

  private _ipc: IpcRenderer | undefined;
  private _subscribedToTrackingData = false;

  public currentData = new BehaviorSubject<ITrackingData>(null);
  public flightActive = new BehaviorSubject<boolean>(false);

  public fsuipcStatus = new BehaviorSubject<boolean>(false);
  public flightStatus = new BehaviorSubject<flightStatus>(flightStatus.preDepature);

  public endFlightEvent = new EventEmitter<IEndFlight>();

  constructor() {
    if (window.require) {
      try {
        this._ipc = window.require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
      console.warn('Electron\'s IPC was not loaded');
    }

    this._startApplication();
  }

  startFlight(icao: string) {
    return new Promise((resolve, reject) => {
      this._ipc.send('startFlight', icao);
      this._ipc.once('startFlight', (event, data: IStartFlightResponse) => {
        if (data.canStart === true) {
          this.currentData.next(data.data);
          console.log(data);
          resolve(data.data);
        } else {
          reject(data.data);
        }
      })
    })
  }

  startFreeFlight() {
    return new Promise<ITrackingData>((resolve, reject) => {
      this._ipc.send('startFreeFlight');
      this._ipc.once('startFreeFlight', (event, data: IStartFlightResponse) => {
        if (data.canStart === true) {
          this.currentData.next(data.data);
          resolve(data.data);
        } else {
          reject(data.data);
        }
      })
    })
  }

  startTracking() {
    return new Promise((resolve, reject) => {
      this._ipc.send('startTracking');
      this._ipc.once('startTracking', async(event, data: boolean) => {
        await this._subscribeToTrackingData();
        this.flightActive.next(true);
        resolve(true);
      })
    })
  }

  private _subscribeToTrackingData() {
    return new Promise<void>((resolve, reject) => {
      if (!this._subscribedToTrackingData) {
        this._ipc.on('trackingData', (event, data: ITrackingData) => {
          this.currentData.next(data);
          resolve();
        })
        this._subscribedToTrackingData = true;
      } else {
        resolve();
      }
    })
  }

  public endFlight(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._ipc.send('stopTracking')
      this._ipc.once('stopTracking', (event, isStopped: boolean) => {
        if (this._subscribedToTrackingData) {
          this._ipc.removeListener('trackingData', null);
          this.flightActive.next(false);
          resolve();
        }
      })
    })
  }

  private _startApplication(): void {
    this._ipc.send('startApplication');
    this._ipc.on('fsuipcStatus', (event, isConnected) => {
      this.fsuipcStatus.next(isConnected);
    })

    this._ipc.on('flightStatus', (event, data:flightStatus) => {
      this.flightStatus.next(data);
    })

    this._ipc.on('endFlight', (event, data: ITrackingData, start: Date, end: Date) => {
      this.endFlightEvent.emit({
        data,
        start,
        end
      });
    })
  }

  
}

export interface IStartFlightResponse {
  canStart: boolean;
  data: ITrackingData;
}

export interface ITrackingData {
  gs: number;
  ias: number;
  vs: number;
  altitude: number;
  longitude: number;
  latitude: number;
  heading: number;
  engine1Firing: boolean;
  engine2Firing: boolean;
  engine3Firing: boolean;
  engine4Firing: boolean;
  atcTypeCode: string;
}

export interface IEndFlight{
  data: ITrackingData;
  start: Date;
  end: Date;
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