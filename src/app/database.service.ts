import { ToastMessageService } from './toast-message.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private baseUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private toast: ToastMessageService
    ) { }


  getFood(start: string, end: string = null) {

    start = moment(start).local().startOf('day').format();
    end = end ? moment(end).local().startOf('day').format() : moment(start).add(1, 'days').local().startOf('day').format();

    const body = {
      query: {
        date : {
          $gte: start,
          $lt: end
        }
      }
    };

    return this.http.post(this.baseUrl + '/food/', body);

  }

  saveFood(food) {

    const body = {
      food: JSON.stringify(food)
    };

    return this.http.post(this.baseUrl + '/food/add', body);

  }
}
