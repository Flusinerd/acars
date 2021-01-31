import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IpcService, ITrackingData } from '../ipc.service';
import { FlightProgressService } from '../flight-progress.service';

@Component({
  selector: 'app-flight-progress',
  templateUrl: './flight-progress.component.html',
  styleUrls: ['./flight-progress.component.scss']
})
export class FlightProgressComponent implements OnInit, OnDestroy {

  currentData: ITrackingData;

  distanceRemain: number = 0;
  timeRemain = 0;
  hoursRemain = 0;
  minutesRemain = 0;

  tripDistance = 0;
  percentageCompleted = 0;
  percentageCompletedRounded = 0;

  dataSubscription: undefined | Subscription;

  constructor(
    private _ipc: IpcService,
    private _changeDetectorRef: ChangeDetectorRef,
    public _flightProgress: FlightProgressService
  ) { }

  ngOnInit(): void {
    this.dataSubscription = this._ipc.currentData.subscribe((data) => {
      if (!data) {
        return
      }
      this.currentData = data
      this.distanceRemain = this._flightProgress.distanceRemaining;

      this.timeRemain = this._flightProgress.timeRemaining;
      const timeSplit = this.timeRemain.toString().split('.');
      this.hoursRemain = +timeSplit[0];
      this.minutesRemain = +('0.' + timeSplit[1]) * 60;

      this.tripDistance = this._flightProgress.tripDistance;
      this.percentageCompleted = 1 - this.distanceRemain / this.tripDistance;
      if (this.percentageCompleted < 0) {
        this.percentageCompleted = 0;
      }
      this.percentageCompletedRounded = Math.round(this.percentageCompleted * 100);

      this._changeDetectorRef.detectChanges();
    })
  }

  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
  }

}
