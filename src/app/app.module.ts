import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HomeModule } from './home/home.module';
import { LiveMapModule } from './live-map/live-map.module';
import { FreeFlightModule } from './free-flight/free-flight.module';
import { BookingsModule } from './bookings/bookings.module';
import { FlightProgressModule } from './flight-progress/flight-progress.module';
import { SimbriefModule } from './simbrief/simbrief.module';
import { PilotModule } from './pilot/pilot.module';
import { WeatherModule } from './weather/weather.module';

import { AppComponent } from './app.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AppConfig } from '../environments/environment';

import { SocketStatusService } from './socket-status.service';
import { SpinnerComponent } from './spinner/spinner.component';

import { TokenInterceptor } from './token.interceptor';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const config: SocketIoConfig = { url: AppConfig.apiUrl , options: {} };

@NgModule({
  declarations: [AppComponent, SpinnerComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    HomeModule,
    FreeFlightModule,
    LiveMapModule,
    FlightProgressModule,
    BookingsModule,
    SimbriefModule,
    PilotModule,
    WeatherModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    LeafletModule
  ],
  providers: [
    { provide: 'Window',  useValue: window },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(
    private _socketService: SocketStatusService
  ) {}

}
