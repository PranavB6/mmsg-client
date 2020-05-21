import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { SocketioService } from '../socketio.service';
import { Subscription, ReplaySubject, observable, pipe } from 'rxjs';
import { map, tap, delay } from 'rxjs/operators';
import { ChatMessage } from 'src/models/chat-message.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {


  public username: string = "";
  public room: string = "";

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onJoinBtn() {

    if (this.username && this.room) {
      this.router.navigate(['/chat'], {
        queryParams: { username: this.username, room: this.room },
      });
    }

  
  }
}
