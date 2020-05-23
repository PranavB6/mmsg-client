import {
    Component,
    OnInit,
    AfterViewInit,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SocketioService } from '../socketio.service';
import { Subscription, ReplaySubject, observable, pipe } from 'rxjs';
import { map, tap, delay } from 'rxjs/operators';
import { ChatMessage } from 'src/models/chat-message.model';
import { MsgType } from 'src/models/msg-type.model';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
    @ViewChild('msgsContainer') msgContainer: ElementRef;

    public username: string;
    public room: string;
    public message: ChatMessage;
    // public message_others: ChatMessage;
    // public message_self: ChatMessage;
    // public message_server: ChatMessage;
    chatMessages: ChatMessage[] = [];

    public typedText = '';

    constructor(
        private socketService: SocketioService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.setHeight();

        this.joinRoom();

        this.socketService.chatMessages$
            .pipe(
                tap((chatMsg: ChatMessage) => this.chatMessages.push(chatMsg)),
                delay(10),
                tap(() => this.scrollToBottom())
            )
            .subscribe();

        // this.message_others = new ChatMessage();
        // this.message_others.from = "Madeeha";
        // this.message_others.text = "sacsacasc";
        // this.message_others.type = MsgType.FROM_OTHERS;

        // this.message_self = new ChatMessage();
        // this.message_self.from = "Pranav";
        // this.message_self.text = "sacsacasc";
        // this.message_self.type = MsgType.FROM_SELF;

        // this.message_server = new ChatMessage();
        // this.message_server.from = "Server";
        // this.message_server.text = "sacsacasc";
        // this.message_server.type = MsgType.SERVER;
    }

    joinRoom() {
        this.route.queryParams.subscribe((params) => {
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
        // this.message = '';
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

    setHeight() {
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
}
