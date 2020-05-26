import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { ChatMessage } from 'src/models/chat-message.model';
import { MsgType } from 'src/models/msg-type.model';
import { RpsHand } from 'src/models/rps-hand.model';

@Injectable({
    providedIn: 'root',
})
export class SocketioService {
    private socket;
    private id;
    private connected = false;
    public chatMessages$: Subject<any>;

    constructor() {
        this.chatMessages$ = new Subject();
    }

    joinRoom(username: string, room: string) {
        this.socket = io(environment.SOCKET_ENDPOINT, {
            query: {
                username,
                room,
            },
        });

        this.setupListeners();
    }

    private setupListeners() {
        this.socket.on('sys', (data) => {
            data.type = MsgType.SYS;
            console.log('[sys]:', data);
            this.id = data.id;
        });

        this.socket.on('server-msg', (data: ChatMessage) => {
            data.type = MsgType.SERVER;
            console.log('[server-msg]:', data);
            this.chatMessages$.next(data);
        });

        this.socket.on('chat-msg', (data: ChatMessage) => {
            data.type = MsgType.FROM_OTHERS;
            console.log('[chat-msg]:', data);
            this.chatMessages$.next(data);
        });

        this.socket.on('confirm-msg', (data: ChatMessage) => {
            data.type = MsgType.FROM_SELF;
            console.log('[confirm-msg]:', data);
            this.chatMessages$.next(data);
        });

        this.socket.on('rps-start', (data: object) => {
            console.log('[rps-start]:', data);
        });

        this.socket.on('rps-result', (data: any) => {
            console.log('[rps-result]:', data);

            let result = this.parseRpsResult(data);

            this.chatMessages$.next(result);
        });

        this.connected = true;
    }

    sendMsg(msg: string) {
        this.socket.emit('chat-msg', msg);
    }

    sendRpsEvent(value: RpsHand) {
        this.socket.emit('rps-hand', value);
    }

    disconnect() {
        console.log('Disconnecting...');
        this.socket.disconnect();
    }

    private parseRpsResult(data: any) {
        let rightPlayer;
        let leftPlayer;

        if (data.player1.id === this.id) {
            rightPlayer = data.player1;
            leftPlayer = data.player2;
        } else {
            rightPlayer = data.player2;
            leftPlayer = data.player1;
        }

        return {
            leftSide: {
                playerName: leftPlayer.name,
                hand: leftPlayer.hand,
                won: leftPlayer.won,
            },
            rightSide: {
                playerName: rightPlayer.name,
                hand: rightPlayer.hand,
                won: rightPlayer.won,
            },
            type: MsgType.RPS_RESULT
        };
    }

    isConnected() {
        return this.connected;
    }
}
