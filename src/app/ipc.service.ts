import { ApplicationRef, ChangeDetectorRef, EventEmitter, Injectable, NgZone } from '@angular/core';
import { IpcRenderer } from 'electron';
import { BehaviorSubject } from 'rxjs';
import { ITrackingData } from '../../trackingData.interface';
import { flightStatus } from '../../flightStatus';
import { Router } from '@angular/router';


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

  public recoveryEvent = new EventEmitter<IRecoveryEvent>();

  constructor(
    private _router: Router,
    private appRef: ApplicationRef,
    private _ngZone: NgZone
  ) {
    if (window.require) {
      try {
        this._ipc = window.require('electron').ipcRenderer;
        this._startApplication();
      } catch (e) {
        throw e;
      }
    } else {
      console.warn('Electron\'s IPC was not loaded');
    }
  }

  startFlight(type: string, flight: string, origin: string, destination: string, cargo: number, pax: number) {
    return new Promise((resolve, reject) => {
      this._ipc.send('startFlight', type, flight, origin, destination, cargo, pax);
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

  startFreeFlight(type: string, flight: string, origin: string, destination: string, cargo: number, pax: number) {
    return new Promise<ITrackingData>((resolve, reject) => {
      this._ipc.send('startFreeFlight', type, flight, origin, destination, cargo, pax);
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
      this._ipc.once('startTracking', async (event, data: boolean) => {
        await this._subscribeToTrackingData();
        this.flightActive.next(true);
        resolve(true);
      })
    })
  }

  private _subscribeToTrackingData() {
    return new Promise<void>((resolve, reject) => {
      console.log('Subbed to data');
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

    this._ipc.on('flightStatus', (event, data: flightStatus) => {
      this.flightStatus.next(data);
    })

    console.log('Subed to endFlight Event');
    this._ipc.on('endFlight', (event, data: ITrackingData, start: Date, end: Date) => {
      console.log('Fight End Triggered')
      this.endFlightEvent.emit({
        data,
        start,
        end
      });
    })

    this._ipc.once('recovery', async (event, origin, destination, cargo, pax) => {
      console.log('Recovery send', origin, destination);
      await this.startTracking();
      this.recoveryEvent.emit({origin, destination, cargo, pax});
    })
  }


}

export interface IStartFlightResponse {
  canStart: boolean;
  data: ITrackingData;
}

export interface IRecoveryEvent {
  origin: string;
  destination: string;
  cargo: number,
  pax: number
}

// export interface ITrackingData {
//   gs: number;
//   ias: number;
//   vs: number;
//   altitude: number;
//   longitude: number;
//   latitude: number;
//   heading: number;
//   engine1Firing: boolean;
//   nearestAirportAltitude: number;
//   atcTypeCode: string;
//   vsAtTouchdown: number;
//   planeOnground: boolean;
//   radioAlt: number;
//   flapsControl: number;
// }

export interface IEndFlight {
  data: ITrackingData;
  start: Date;
  end: Date;
}