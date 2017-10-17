import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatAutocompleteModule, MatChipsModule, MatTooltipModule, MatSidenavModule, MatButtonModule, MdButtonModule, MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule, MatInputModule } from '@angular/material';
import { routing }  from './app.routing';
import { AuthService } from './services/auth.service';
import { MsgService } from './services/msg.service';

import { AppComponent } from './app.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { ComposeComponent } from './components/compose/compose.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MessagesComponent } from './components/messages/messages.component';
import { FileSelectDirective } from 'ng2-file-upload';
@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    InboxComponent,
    ComposeComponent,
    SidenavComponent,
    MessagesComponent,
    FileSelectDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatChipsModule,
    MatTooltipModule,
    MatButtonModule,
    MatInputModule,
    MdButtonModule,
    MdMenuModule,
    MdCardModule,
    MdToolbarModule,
    MdIconModule,
    routing,
  ],
  providers: [AuthService, MsgService],
  bootstrap: [AppComponent]
})
export class AppModule { }
