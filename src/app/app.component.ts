import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnDestroy } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { IpcService } from './ipc.service';
import { Subscription } from 'rxjs';
import { AirportsService } from './airports.service';
import { FlightProgressService } from './flight-progress.service';
import { Router } from '@angular/router';
import { SocketStatusService } from './socket-status.service';
import { LoadingService } from './loading.service';
import { inOutAnimation } from './animations/inOut';
import { SimbriefService } from './simbrief/simbrief.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [inOutAnimation('200ms')]
})
export class AppComponent implements OnDestroy, AfterViewInit {

  fsuipcConnectionStatus = false;
  httpConnectionStatus = false;
  isLoading = false;

  private _fsuipcStatusSub: Subscription | undefined;
  private _httpStatusSub: Subscription | undefined;
  private _loadingStatusSub: Subscription | undefined;

  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    public ipc: IpcService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _airportService: AirportsService,
    private _progress: FlightProgressService,
    private _router: Router,
    private _socketStatus: SocketStatusService,
    private _loadingService: LoadingService,
    private _simBriefService: SimbriefService
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

    this.loadAirports();
  }

  async loadAirports(): Promise<void> {
    let allFetched = false;
    let page = 0;
    while(!allFetched) {
      const length = (await this._airportService.getAirports(100, page * 100)).length;
      page += 1;
      if (length < 100) {
        allFetched = true;
      }
    }
  }

  ngAfterViewInit(): void {
    this._fsuipcStatusSub = this.ipc.fsuipcStatus.subscribe((connectionStatus) => {
      this.fsuipcConnectionStatus = connectionStatus;
      this._changeDetectorRef.detectChanges();
    })

    this._httpStatusSub = this._socketStatus.isConnected.subscribe((connectionStatus) => {
      this.httpConnectionStatus = connectionStatus;
      this._changeDetectorRef.detectChanges();
    })

    this._loadingStatusSub = this._loadingService.isLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
      this._changeDetectorRef.detectChanges();
    })
  }

  async onTracking(): Promise<void> {
    await this.ipc.startTracking();
    console.log('Tracking started');
    try {
      await this._progress.registerFlight('eddf', 'eddl', 'MQT1922',1000, 200,  false);
      console.log('Flight registered');
      this._router.navigateByUrl('flight-progress')
    } catch (error) {
      console.error(error);
    }
  }


  ngOnDestroy(): void {
    this._fsuipcStatusSub?.unsubscribe();
    this._httpStatusSub?.unsubscribe();
    this._loadingStatusSub?.unsubscribe();
  }

  async testSimbrief(){
    // this._simBriefService.simbriefsubmit('http://localhost:4200/callback', 'eddf', 'eddl', 'a320');
    console.log("🚀 ~ file: app.component.ts ~ line 109 ~ AppComponent ~ testSimbrief ~ await this._simBriefService.mockresponse();", await this._simBriefService.mockresponse())
  }

  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHandler() {
    this._socketStatus.onDisconnect()
  }
}
