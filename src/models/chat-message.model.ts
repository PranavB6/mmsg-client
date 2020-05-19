import { MsgType } from './msg-type.model';

export class ChatMessage {
    from: string;
    text: string;
    date: Date;

    type: MsgType;
}
