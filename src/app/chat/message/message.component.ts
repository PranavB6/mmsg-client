import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChatMessage } from 'src/models/chat-message.model';
import { MsgType } from 'src/models/msg-type.model';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
    @Input("message") msg: any = {};

    MsgType = MsgType;

    constructor() {}

    ngOnInit(): void {}
}
