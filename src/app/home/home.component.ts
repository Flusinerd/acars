import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IpcService } from '../ipc.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private _ipc: IpcService
    ) { }

  ngOnInit(): void { }

  async onStartFlight(): Promise<void> {
    console.log('starting flight');
    const startData = await this._ipc.startFlight("eddf");
    console.log(startData);

    this._ipc.startTracking();
  }

}
