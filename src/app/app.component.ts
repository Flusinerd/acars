import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { IpcService } from './ipc.service';
import { Subscription } from 'rxjs';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, AfterViewInit {

  connectionStatus = false;

  private _statusSub: Subscription | undefined;

  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    public ipc: IpcService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }
  }

  ngAfterViewInit(): void {
    this._statusSub = this.ipc.fsuipcStatus.subscribe((connectionStatus) => {
      this.connectionStatus = connectionStatus;
      this._changeDetectorRef.detectChanges();
    })
  }

  onTracking(): void {
    this.ipc.startTracking();
    console.log('Tracking started');
  }


  ngOnDestroy(): void {
    this._statusSub?.unsubscribe();
  }
}
