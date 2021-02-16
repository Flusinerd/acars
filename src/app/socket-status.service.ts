import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';


const SOCKET_DISCONNECT_KEY = 'acars_socket_disconnect_time';
const SOCKET_UUID_KEY = 'acars_socket_uuid';

@Injectable({
  providedIn: 'root'
})
export class SocketStatusService {

  isConnected = new BehaviorSubject<boolean>(false);

  private _connectionTimeout = 30 * 60 * 1000 // 30min in ms

  constructor(
    private _socket: Socket
  ) {
    this._socket.fromEvent('connect').subscribe(async () => {
      const uuid = await this._socket.fromOneTimeEvent('onConnect') as string;
      await this.tryReconnect(uuid);
      this.isConnected.next(true);
    })
    this._socket.fromEvent('disconnect').subscribe(() => {
      this.isConnected.next(false);
      this.onDisconnect()
    })
  }

  onDisconnect() {
    window.localStorage.removeItem(SOCKET_DISCONNECT_KEY);
    window.localStorage.setItem(SOCKET_DISCONNECT_KEY, new Date().valueOf().toString());
  }

  async tryReconnect(newUuid: string) {
    const needsReconnect = this.isReconnect();
    const uuid = window.localStorage.getItem(SOCKET_UUID_KEY);
    console.log('uuid', uuid)
    console.log("🚀 ~ file: socket-status.service.ts ~ line 34 ~ SocketStatusService ~ tryReconnect ~ needsReconnect", needsReconnect)
    if (needsReconnect && uuid) {
      this._socket.emit('reconnectAcars', uuid);
      const reconnectResult = await this._socket.fromOneTimeEvent('reconnectAcars');
      if (!reconnectResult) {
        window.localStorage.removeItem(SOCKET_UUID_KEY);
        window.localStorage.setItem(SOCKET_UUID_KEY, newUuid);
      }
    } else {
      window.localStorage.removeItem(SOCKET_UUID_KEY);
      window.localStorage.setItem(SOCKET_UUID_KEY, newUuid);
    }
  }

  isReconnect(): boolean {
    const timeoutAt = window.localStorage.getItem(SOCKET_DISCONNECT_KEY);
    console.log("🚀 ~ file: socket-status.service.ts ~ line 54 ~ SocketStatusService ~ isReconnect ~ timeoutAt", timeoutAt)


    // If nothing set -> No reconnect for sure
    if (!timeoutAt) {
      return false;
    }

    // Timeout is set so check when it was
    // If it was within the last 30 minutes, try to reconnect
    const timeoutAtMillis = new Date(+timeoutAt).valueOf();
    const millisNow = new Date().valueOf();
    const difference = millisNow - timeoutAtMillis;
    console.log("🚀 ~ file: socket-status.service.ts ~ line 67 ~ SocketStatusService ~ isReconnect ~ difference", difference)
    console.log("🚀 ~ file: socket-status.service.ts ~ line 69 ~ SocketStatusService ~ isReconnect ~ _connectionTimeout", this._connectionTimeout)
    if (difference < this._connectionTimeout) {
      return true;
    }
    return false;
  }


}
