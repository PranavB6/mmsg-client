import {
    Component,
    OnInit,
    AfterViewInit,
    ViewChild,
    ElementRef,
    OnDestroy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SocketioService } from '../socketio.service';
import { Subscription, ReplaySubject, observable, pipe } from 'rxjs';
import { map, tap, delay } from 'rxjs/operators';
import { ChatMessage } from 'src/models/chat-message.model';
import { MsgType } from 'src/models/msg-type.model';
import { RpsHand } from 'src/models/rps-hand.model';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
    @ViewChild('msgsContainer') msgContainer: ElementRef;
    RpsHand = RpsHand;

    dummy;
    public username: string = '';
    public room: string = '';
    public typedText: string = '';

    chatMessages: ChatMessage[] = [];

    constructor(
        private socketService: SocketioService,
        private route: ActivatedRoute
    ) {
        // let dummy = new ChatMessage();
        // dummy.type = MsgType.RPS_RESULT;
        // this.chatMessages.push(dummy);
    }

    ngOnInit(): void {
        this.setWindowHeight();

        this.joinRoom();

        this.socketService.chatMessages$
            .pipe(
                tap((chatMsg: ChatMessage) => this.chatMessages.push(chatMsg)),
                delay(10),
                tap(() => this.scrollToBottom())
            )
            .subscribe();
    }

    joinRoom() {
        this.route.queryParams.subscribe((params: any) => {
            this.username = params.username;
            this.room = params.room;
            this.socketService.joinRoom(this.username, this.room);
        });
    }

    onSendMsg() {
        if (this.typedText != '') {
            this.socketService.sendMsg(this.typedText);
            this.typedText = '';
        }
    }

    onSendRpsEvent(value: RpsHand) {
        this.socketService.sendRpsEvent(value);
    }

    scrollToBottom() {
        if (this.msgContainer) {
            let container = this.msgContainer.nativeElement;
            container.scroll({
                top: container.scrollHeight,
                left: 0,
                behavior: 'smooth',
            });
        }

        // let container = document.querySelector('#msg-container');
        // container.scrollTop = container.scrollHeight;
    }

    setWindowHeight() {
        // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
        let vh = window.innerHeight * 0.01;
        // Then we set the value in the --vh custom property to the root of the document
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        // We listen to the resize event
        window.addEventListener('resize', () => {
            // We execute the same script as before
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        });
    }

    ngOnDestroy() {
        this.socketService.disconnect();
    }
}
