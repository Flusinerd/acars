import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { icaoValidator } from '../shared/validators/icao.validator';
import { flValidator } from '../shared/validators/flighLevel.validator';
import { flightNoValidator } from '../shared/validators/flightNo.validator';
import { IpcService, ITrackingData } from '../ipc.service';
import { BehaviorSubject } from 'rxjs';

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
  ) {
    this.freeFlightForm = this._fb.group({
      origin: ['', [Validators.required, icaoValidator()]],
      destination: ['', [Validators.required, icaoValidator()]],
      flightNo: ['', [Validators.required, flightNoValidator()]],
      cruiseLevel: ['', [Validators.required, flValidator()]],
      passengers: ['', [Validators.required]],
      cargo: ['', [Validators.required]],
      route: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.freeFlightForm.valueChanges.subscribe((val) => {})
  }

  async onStartFlight(): Promise<void> {
    try {
      const data = await this._icp.startFreeFlight();
      this.trackingData.next(data);
      await this._icp.startTracking();
      this._icp.currentData.subscribe((data) => {
        this.trackingData.next(data);
        console.table(data);
      })
    } catch (error) {
      console.error(error);
    }
  }

}
