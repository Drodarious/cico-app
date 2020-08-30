import { ToastMessageService } from './../toast-message.service';
import { DatabaseService } from './../database.service';
import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { take, debounceTime } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-user-log',
  templateUrl: './user-log.component.html',
  styleUrls: ['./user-log.component.scss']
})
export class UserLogComponent implements OnInit {

  @Input() refresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  meals = {
    breakfast: [],
    lunch: [],
    dinner: []
  };

  exercise = [];

  currentDay: Date = new Date();
  dateTitle = '';
  noData = false;
  totalCalFromFood = 0;
  totalCalFromExercise = 0;
  totalCalFromBase = 3000;

  constructor(
    private db: DatabaseService,
    private toast: ToastMessageService
  ) { }

  ngOnInit(): void {
    this.refresh.subscribe(() => {
      this.search();
    });
  }

  nextDay() {
    this.currentDay = moment(this.currentDay).add(1, 'days').toDate();
    this.search();
  }

  prevDay() {
    this.currentDay = moment(this.currentDay).subtract(1, 'days').toDate();
    this.search();
  }

  search() {

    this.updateTitle();
    this.getFood();

  }

  private updateTitle() {
    this.dateTitle = moment(this.currentDay).format('dddd - MMM D, YYYY');
  }

  private getFood() {

    this.db.getFood(this.currentDay.toString()).pipe(debounceTime(400), take(1)).subscribe(
      (success) => {

        this.meals.breakfast = [];
        this.meals.lunch = [];
        this.meals.dinner = [];

        this.totalCalFromFood = 0;

        if (Array.isArray(success) && success.length > 0) {

          success.forEach((item) => {

            item.food = JSON.parse(item.food);

            this.totalCalFromFood += item.food.log_display.calories;

            const hour: number = moment(item.date).hour();
            if (hour <= 11) {
              this.meals.breakfast.push(item);
            } else if (hour > 5) {
              this.meals.dinner.push(item);
            } else {
              this.meals.lunch.push(item);
            }

          });

          this.noData = false;

          console.log(this.meals);

        } else {
          this.noData = true;
        }
      },
      (error) => {
        this.noData = true;
        this.toast.error('Failed to load food for current day.');
      }
    );

  }

}
