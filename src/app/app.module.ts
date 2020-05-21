import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketioService } from './socketio.service';
import { ChatComponent } from './chat/chat.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth-guard.service';
import { MessageComponent } from './chat/message/message.component';

@NgModule({
  declarations: [AppComponent, ChatComponent, HomeComponent, MessageComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [SocketioService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
