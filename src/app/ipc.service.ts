import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';


@Injectable({
  providedIn: 'root'
})
export class IpcService {

  private _ipc: IpcRenderer | undefined;

  private _subscribedToTrackingData = false;

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
  }

  startFlight(icao: string) {
    return new Promise((resolve, reject) => {
      this._ipc.send('startFlight', icao);
      this._ipc.on('startFlight', (event, data) => {
        console.log(data);
        resolve(data)
      })
    })
  }

  startTracking() {
    this._ipc.send('startTracking');
    this._ipc.once('startTracking', (event, data) => {
      if (data) {
        console.log('Started Tracking');
      } else {
        console.log('Could not start tracking');
      }
    })
    this._subscribeToTrackingData();
  }

  private _subscribeToTrackingData() {
    if (!this._subscribedToTrackingData) {
      this._ipc.on('trackingData', (event, data) => {
        console.log('Flight Data');
        console.table(data);
      })
      this._subscribedToTrackingData = true;
    }
  }
}
