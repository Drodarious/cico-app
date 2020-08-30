import { debounceTime } from 'rxjs/operators';
import { ToastMessageService, ToastMessage, ToastMessageTypes } from './../toast-message.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast-message',
  templateUrl: './toast-message.component.html',
  styleUrls: ['./toast-message.component.scss']
})
export class ToastMessageComponent implements OnInit {

  message: ToastMessage = null;
  showMessage = false;

  constructor(
    private service: ToastMessageService
  ) { }

  ngOnInit(): void {

    this.service.message.subscribe((message) => {
      if (!message) { return; }
      this.message = message;
      this.showMessage = true;
      setTimeout((e) => {
        this.showMessage = false;
      }, 5000);
    });

  }

  hide() {
    this.message = null;
  }

}
