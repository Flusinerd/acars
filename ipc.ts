import { ipcMain } from "electron";
import { FSUIPCApi } from "./main";

export function registerIPC() {

  // Start flight event
  ipcMain.on('startFlight', async (event, data) => {
    console.log('starFlight Event triggered');
    try {
      const info = await FSUIPCApi.canStartFlight(data);
      event.reply('startFlight', info);
    } catch (error) {
      event.reply('startFlight', error);
    }
  })

  ipcMain.on('startTracking', (event) => {
    console.log('Starting flight tracking');
    const obs = FSUIPCApi.flightTrackingObs.subscribe((data) => {
      console.log(data);
      event.reply('trackingData', data);
    })
    event.reply('startTracking', true);
  })

}