import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketStatusService {

  isConnected = new BehaviorSubject<boolean>(false);

  constructor(
    private _socket: Socket
  ) {
    this._socket.fromEvent('connect').subscribe(() => {
      this.isConnected.next(true);
    })
    this._socket.fromEvent('disconnect').subscribe(() => {
      this.isConnected.next(false);
    })
  }
}
