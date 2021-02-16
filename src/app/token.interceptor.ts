import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { PilotService } from './pilot.service'

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private _pilotService: PilotService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this._pilotService.isLoggedIn) {
      return next.handle(request);
    } else {
      const requestWithToken = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${this._pilotService.accessToken}`,
        }
      })
      return next.handle(requestWithToken);
    }
  }
}
