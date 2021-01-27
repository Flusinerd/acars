import { ipcMain } from "electron";
import { Subscription } from "rxjs";
import { debounce, debounceTime } from "rxjs/operators";
import { FSUIPCApi } from "./main";

let trackingSub: undefined | Subscription = undefined;

export function registerIPC() {

  ipcMain.on('startApplication', (event, data) => {
    FSUIPCApi.connectionObs.pipe(debounceTime(100)).subscribe((isConnected) => {
      event.reply('fsuipcStatus', isConnected);
    })
  })

  // Start flight event
  ipcMain.on('startFlight', async (event, icao: string) => {
    console.log('starFlight Event triggered');
    try {
      const data = await FSUIPCApi.canStartFlight(icao);
      event.reply('startFlight', {canStart: true, data});
    } catch (error) {
      event.reply('startFlight', {canStart: true, data: error});
    }
  })

  ipcMain.on('startFreeFlight', async (event, _data) => {
    try {
      const data = await FSUIPCApi.canStartFreeFlight();
      event.reply('startFreeFlight', {canStart: true, data});
    } catch(error) {
      event.reply('startFreeFlight', {canStart: false, data: error});
    }
  })

  ipcMain.on('startTracking', (event) => {
    console.log('Starting flight tracking');
    if (!trackingSub) {
      trackingSub = FSUIPCApi.flightTrackingObs.subscribe((data) => {
        event.reply('trackingData', data);
      })
    }
    event.reply('startTracking', true);
  })

  ipcMain.on('stopTracking', (event) => {
    if (trackingSub) {
      trackingSub.unsubscribe();
    }
    event.reply('stopTracking', true);
  })

}