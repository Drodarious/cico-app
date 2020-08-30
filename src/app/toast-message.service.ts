import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum ToastMessageTypes {
  Error = 'error',
  Success = 'success'
}

export class ToastMessage {
  text: string;
  type: ToastMessageTypes;
}

@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {

  message: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private message$ = new ToastMessage();

  constructor() { }

  success(message) {
    this.message$.text = message;
    this.message$.type = ToastMessageTypes.Success;
    this.message.next(this.message$);
  }

  error(message) {
    this.message$.text = message;
    this.message$.type = ToastMessageTypes.Error;
    this.message.next(this.message$);
  }
}
