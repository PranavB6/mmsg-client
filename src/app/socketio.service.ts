import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { ChatMessage } from 'src/models/chat-message.model';

@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  private socket;
  private connected = false;
  public chatMessages$: Subject<ChatMessage>;

  constructor() {
    this.chatMessages$ = new Subject();
  }

  joinRoom(username: string, room: string) {
    this.setupSocketConnection();
    this.socket.emit('join-room', { username, room });
  }

  private setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT);

    this.socket.on('sys', (data: string) => {
      console.log(`[sys]: ${data}`);
    });

    this.socket.on('server-msg', (data: string) => {
      console.log(`[server-msg]: ${data}`);
    });

    this.socket.on('chat-msg', (msg: ChatMessage) => {
      console.log(`[chat-msg]: ${msg}`);
      this.chatMessages$.next(msg);
    });

    this.connected = true;
  }

  sendMsg(msg: string) {
    this.socket.emit('chat-msg', msg);
  }

  isConnected() {
    return this.connected;
  }
}
