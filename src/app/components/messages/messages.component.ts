import {  Component, EventEmitter, Input, Output,  OnInit, ViewChild } from '@angular/core';
import {  NgForm, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MsgService } from '../../services/msg.service';
import { ConversationInfo } from '../../interfaces/conversation-info';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  public uploader:FileUploader = new FileUploader({});
  @Input() conversation_id: string;
  @Input() conversation_info: ConversationInfo;
  @Input() username: string;
  root_url:string;
  messages_url:string = '/api/messages/?format=json';
  message_create_url:string = '/api/message/create';
  message:string=null;
  conversation_with:string;
  success_msg:boolean =false;

  next_page_url:string;
  previous_page_url:string;
  next_page_disable:boolean;
  previous_page_disable:boolean;
  
  messages:any[];
  token:string;
  files : FileList; 

  private base64textString:string="";
  @ViewChild('imageFile')
  imageFileVariable: any;

  constructor(private msgService:MsgService, private authService:AuthService) { }

  ngOnInit() {
  	this.root_url = this.authService.get_root_url();
  	this.token = this.authService.getToken();
    this.msgService.getMessages(this.root_url + this.messages_url + '&conversation_id=' + this.conversation_info.conversation_id, this.token).subscribe((messages) => {
        this.common_operation(messages);
    });
  }
  getFiles(event){ 
    this.files = event.target.files;
    console.log(this.files); 
  }

  handleImageFileSelect(evt)  {
    let files = evt.target.files;
    let file = files[0];
    if (files && file) {
        let reader = new FileReader();
        reader.onload =this._handleImageReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
    }
  }
  _handleImageReaderLoaded(readerEvt) {
     let binaryString = readerEvt.target.result;
            this.base64textString= btoa(binaryString);
  }
  
  send_message(form: NgForm) {
    let msg_data = {
      msg_sender: this.username,
      msg_receiver: this.conversation_with,
      message: form.value.message,
      image: this.base64textString,
      // file: this.base64filetextString,
      conversation_id: this.conversation_info.conversation_id,
      conversation_subject: this.conversation_info.conversation_subject
    };
    console.log(msg_data);
    this.msgService.create_message(this.root_url + this.message_create_url, msg_data, this.token).subscribe((message) => {
        this.success_msg = true;
        this.message = '';
        this.imageFileVariable.nativeElement.value = "";
        this.reset_page();
    });
  }

  go_to_next_page() {
      this.msgService.getMessages(this.next_page_url, this.token).subscribe((inboxes) => {
          this.common_operation(inboxes);
      });
  }
  go_to_previous_page() {
      this.msgService.getMessages(this.previous_page_url, this.token).subscribe((inboxes) => {
          this.common_operation(inboxes);
      });
  }

  common_operation(messages) {
      this.messages = messages.results;
      this.next_page_url = messages.next;
      this.previous_page_url = messages.previous;
      
      if (this.username == this.messages[0].msg_receiver.username) { 
      	this.conversation_with = this.messages[0].msg_sender.username;
      } else if(this.username == this.messages[0].msg_sender.username) {
      	this.conversation_with = this.messages[0].msg_receiver.username;
      }
      console.log(this.conversation_with);
      console.log(this.messages);
      console.log(this.previous_page_url);
      console.log(this.next_page_url);

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
    this.msgService.getMessages(this.root_url + this.messages_url + '&conversation_id=' + this.conversation_info.conversation_id, this.token).subscribe((messages) => {
        this.common_operation(messages);
    });
  }

  close_success_msg() {
    this.success_msg = false;
  }

}

