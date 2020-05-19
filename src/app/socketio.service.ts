import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { ChatMessage } from 'src/models/chat-message.model';
import { MsgType } from 'src/models/msg-type.model';

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

    this.socket.on('sys', (data: ChatMessage) => {
      data.type = MsgType.SYS;
      console.log("[sys]:", data);
    });

    this.socket.on('server-msg', (data: ChatMessage) => {
      data.type = MsgType.SERVER;
      console.log("[server-msg]:", data);
    });

    this.socket.on('chat-msg', (data: ChatMessage) => {
      data.type = MsgType.CHAT;
      console.log("[chat-msg]:", data);
      this.chatMessages$.next(data);
    });

    this.socket.on('confirm-msg', (data: ChatMessage) => {
      data.type = MsgType.FROM_SELF;
      console.log("[confirm-msg]:", data);
      this.chatMessages$.next(data);
    })

    this.connected = true;
  }

  sendMsg(msg: string) {
    this.socket.emit('chat-msg', msg);
  }

  isConnected() {
    return this.connected;
  }
}
