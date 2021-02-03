import { Component, OnInit } from '@angular/core';
import { IpcService } from '../ipc.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {

  constructor(
    private _ipc: IpcService
  ) { }

  ngOnInit(): void {
  }

  async onStartFlight(): Promise<void> {
    try {
      await this._ipc.startFlight('A320', 'MQT1922', 'EDDF', 'EDDL');
    } catch (error) {
      switch (error) {
        case 'Depature Airport not found':
          console.log('Cannot start flight, depature airport not found in database')
          break;
        case 'Too far':
          console.log('Cannot start flight, too far from depature')
          break;
        case 'No connection to Sim':
          console.log('Cannot start flight, no connection to sim')
          break;
        case 'Too fast':
          console.log('Cannot start flight, moving to fast')
          break;
        case 'Engine(s) running':
          console.log('Cannot start flight, engine(s) running')
          break;
      }
    }

    await this._ipc.startTracking();
  }

}
