import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { icaoValidator } from '../shared/validators/icao.validator';
import { flValidator } from '../shared/validators/flighLevel.validator';
import { flightNoValidator } from '../shared/validators/flightNo.validator';
import { IpcService } from '../ipc.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { FlightProgressService } from '../flight-progress.service';
import { ITrackingData } from '../../../trackingData.interface';
import { SimbriefService } from '../simbrief/simbrief.service';

@Component({
  selector: 'app-free-flight',
  templateUrl: './free-flight.component.html',
  styleUrls: ['./free-flight.component.scss']
})
export class FreeFlightComponent implements OnInit {

  freeFlightForm: FormGroup;

  trackingData = new BehaviorSubject<ITrackingData>(null);

  constructor(
    private _fb: FormBuilder,
    private _icp: IpcService,
    private _router: Router,
    private _progress: FlightProgressService,
    private _simBriefService: SimbriefService
  ) {
    this.freeFlightForm = this._fb.group({
      origin: ['', [Validators.required, icaoValidator()]],
      destination: ['', [Validators.required, icaoValidator()]],
      flightNo: ['', [Validators.required, flightNoValidator()]],
      passengers: ['', [Validators.required]],
      cargo: ['', [Validators.required]],
      // cruiseLevel: ['', [Validators.required, flValidator()]],
      // route: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.freeFlightForm.valueChanges.subscribe((val) => { })
  }

  async onStartFlight(): Promise<void> {
    // console.log(await this._simBriefService.mockresponse());
    const origin = this.freeFlightForm.get('origin').value as string;
    const destination = this.freeFlightForm.get('destination').value as string;
    const callSign = this.freeFlightForm.get('flightNo').value as string;
    const cargo = this.freeFlightForm.get('cargo').value as number;
    const pax = this.freeFlightForm.get('passengers').value as number;
    try {
      const data = await this._icp.startFreeFlight('A320', callSign.toUpperCase(), origin.toLowerCase(), destination.toLowerCase(), cargo, pax);
      this.trackingData.next(data);
      await this._icp.startTracking();
      console.log('Tracking started');
    } catch (error) {
      console.error(error);
      return;
    }

    // Tracking started, start flight reporting
    try {
      await this._progress.registerFlight(origin.toLowerCase(), destination.toLowerCase(), callSign, cargo, pax, false);
      console.log('Flight registered');
      this._router.navigateByUrl('flight-progress')
    } catch (error) {
      console.error(error);
    }
  }

}
