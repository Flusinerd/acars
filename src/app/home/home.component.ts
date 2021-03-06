import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { IpcService } from '../ipc.service';
import { LoadingService } from '../loading.service';
import { Pilot, PilotService, Rank } from '../pilot.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  pilot: Pilot
  ranks = Rank;

  constructor(
    private _pilotService: PilotService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _loadingService: LoadingService,
    ) { }

  ngOnInit(): void {
    this._pilotService.currentPilot.subscribe((pilot) => {
      this.pilot = pilot;
      this._changeDetectorRef.detectChanges();
    });
  }
}
