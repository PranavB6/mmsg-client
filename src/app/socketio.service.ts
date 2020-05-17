import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketioService {

  private socket;
  
  constructor() {}

  setupSocketConnection() {
    console.log("Called");
    this.socket = io(`http://localhost:3000`);
  }
}
