import { BehaviorSubject } from 'rxjs';
import { ToastMessageService } from './toast-message.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  selectedDate: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());

  private baseUrl = 'http://localhost:3000';
  private $selectedDate: Date;

  constructor(
    private http: HttpClient,
    private toast: ToastMessageService
  ) {
    this.selectedDate.subscribe((date) => { this.$selectedDate = date; });
  }


  // Food

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
      food: JSON.stringify(food),
      date: this.$selectedDate
    };

    return this.http.post(this.baseUrl + '/food/add', body);

  }

  removeFood(id) {

    return this.http.post(this.baseUrl + '/food/remove', { id });

  }


  // Exercise


  getExercise(start: string, end: string = null) {

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

    return this.http.post(this.baseUrl + '/exercise/', body);

  }

  saveExercise(exercise) {

    const body = {
      name: exercise.name,
      calPerMin: exercise.calPerMin,
      met: exercise.met,
      duration: exercise.duration,
      photo: JSON.stringify(exercise.photo),
    };

    return this.http.post(this.baseUrl + '/exercise/add', body);

  }

  removeExercise(id) {

    return this.http.post(this.baseUrl + '/exercise/remove', { id });

  }


  // Stats
  saveStats(food: number, exercise: number, base: number, cico: number) {

    const start = moment(this.$selectedDate).local().startOf('day').format();
    const end = moment(this.$selectedDate).add(1, 'days').local().startOf('day').format();

    const body = {
      food,
      exercise,
      base,
      cico,
      date: this.$selectedDate,
      query: { date: { $gte: start, $lt: end } }
    };

    return this.http.post(this.baseUrl + '/stats/add', body);

  }

}
