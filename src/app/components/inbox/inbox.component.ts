import {  Component, EventEmitter, Input, Output,  OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MsgService } from '../../services/msg.service';
import { ConversationInfo } from '../../interfaces/conversation-info';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  
  @Output() conversation_info = new EventEmitter<ConversationInfo>();
  @Input() username: string;
  @Input() archived_inbox: boolean;

  root_url:string;
  inbox_url:string = '/api/conversations/?format=json';
  
  next_page_url:string;
  previous_page_url:string;
  
  next_page_disable:boolean;
  previous_page_disable:boolean;
  
  inboxes:any[];
  token:string;

  constructor(private msgService:MsgService, private authService:AuthService) { }
  ngOnInit() {
    this.root_url = this.authService.get_root_url();
    console.log(this.root_url);
  	this.token = this.authService.getToken();
    this.msgService.getInboxes(this.root_url + this.inbox_url + '&username=' + this.username +'&archived='+ this.archived_inbox, this.token).subscribe((inboxes) => {
        console.log(this.root_url + this.inbox_url + '&username=' + this.username +'&archived='+ this.archived_inbox);
        this.common_operation(inboxes);
    });
    console.log(this.archived_inbox);
  }

  get_message(conversation_id: string, conversation_subject: string) {
    console.log("Inbox");
    console.log(conversation_id);
    let conversation_info:ConversationInfo = {
      conversation_id: conversation_id,
      conversation_subject: conversation_subject,
      archived: this.archived_inbox
    };
    this.conversation_info.emit(conversation_info);
  }
  archived_conversation(archive_url:string) {
    console.log(archive_url);
      this.msgService.archiveCoversation(archive_url, this.token, true).subscribe((response) => {
          console.log(response);
          this.reset_page();
      });
  }
  un_archived_conversation(archive_url:string) {
    console.log(archive_url);
      this.msgService.archiveCoversation(archive_url, this.token, false).subscribe((response) => {
          console.log(response);
          this.reset_page();
      });
  }
  delete_conversation(delete_url:string) {
      this.msgService.deleteCoversation(delete_url, this.token).subscribe((response) => {
          console.log(response);
          this.reset_page();
      });  
  }
  go_to_next_page() {
      this.msgService.getInboxes(this.next_page_url, this.token).subscribe((inboxes) => {
          this.common_operation(inboxes);
      });
  }
  go_to_previous_page() {
      this.msgService.getInboxes(this.previous_page_url, this.token).subscribe((inboxes) => {
          this.common_operation(inboxes);
      });
  }
  common_operation(inboxes) {
      this.inboxes = inboxes.results;
      this.next_page_url = inboxes.next;
      this.previous_page_url = inboxes.previous;
      console.log(this.inboxes);
      if (this.next_page_url == null) {
          this.next_page_disable = true;
      }
      else {
          this.next_page_disable = false;
      }
      
      if (this.previous_page_url == null) {
          this.previous_page_disable = true;
      }
      else {
          this.previous_page_disable = false;
      }
  }

  reset_page() {
    this.msgService.getInboxes(this.root_url + this.inbox_url + '&username=' + this.username +'&archived='+ this.archived_inbox, this.token).subscribe((inboxes) => {
        this.common_operation(inboxes);
    });
  }






}
