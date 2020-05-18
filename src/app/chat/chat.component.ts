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

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @ViewChild('msgContainer') msgContainer: ElementRef;

  public username: string;
  public room: string;
  public message: string;
  chatMessages: ChatMessage[] = [];

  constructor(
    private socketService: SocketioService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.joinRoom();

    this.socketService.chatMessages$
      .pipe(
        tap((chatMsg: ChatMessage) => this.chatMessages.push(chatMsg)),
        delay(10),
        tap(() => this.scrollToBottom())
      )
      .subscribe();

    // let queryParams = this.route.snapshot.queryParams;
    // this.username = queryParams.username;
    // this.room = queryParams.room;

    // console.log(this.username, this.room);
  }

  joinRoom() {

    this.route.queryParams.subscribe((params) => {
      this.username = params.username;
      this.room = params.room;
      this.socketService.joinRoom(this.username, this.room);
    })

    // let params = this.route.snapshot.queryParams;
    // this.username = params.username;
    // this.room = params.room;

  }

  onSendMsg() {

    this.socketService.sendMsg(this.message);
    this.message = '';
  }

  scrollToBottom() {
    let container = this.msgContainer.nativeElement;
    container.scroll({
      top: container.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
    // let container = document.querySelector('#msg-container');
    // container.scrollTop = container.scrollHeight;
  }
}
