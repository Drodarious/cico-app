import { ToastMessageService } from './../toast-message.service';
import { DatabaseService } from './../database.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { take, debounceTime, finalize } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-user-log',
  templateUrl: './user-log.component.html',
  styleUrls: ['./user-log.component.scss']
})
export class UserLogComponent implements OnInit, OnDestroy {

  @Input() refresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  meals = {
    breakfast: [],
    lunch: [],
    dinner: []
  };

  exercise = [];

  currentDay: Date = new Date();
  dateTitle = '';
  hasFood = false;
  hasExercise = false;
  totalCalFromFood = 0;
  totalCalFromExercise = 0;
  totalCalFromBase = 3000;
  detailItem = null;

  // on next value, check if value === 2 (get promises resolved), if so update stats for current day
  private statUpdater: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(
    private db: DatabaseService,
    private toast: ToastMessageService
  ) { }

  ngOnInit(): void {
    this.refresh.subscribe((e) => {
      this.search();
    });
    this.statUpdater.subscribe((statsRetrievedSuccessfully) => {
      if (statsRetrievedSuccessfully === 2) {
        this.updateStats();
        this.statUpdater.next(0);
      }
    });
  }

  ngOnDestroy(): void {
    this.refresh.unsubscribe();
    this.statUpdater.unsubscribe();
  }

  nextDay() {
    this.currentDay = moment(this.currentDay).add(1, 'days').toDate();
    this.search();
  }

  prevDay() {
    this.currentDay = moment(this.currentDay).subtract(1, 'days').toDate();
    this.search();
  }

  showDetails(item) {
    this.detailItem = item;
  }

  clearDetailItem() {
    this.detailItem = null;
  }

  search() {
    this.statUpdater.next(0);
    this.db.selectedDate.next(this.currentDay);
    this.updateTitle();
    this.getFood();
    this.getExercise();
  }

  removeItem(item) {
    if (item.food) {
      this.removeFoodItem();
    } else {
      this.removeExerciseItem();
    }
    this.detailItem = null;
  }

  removeFoodItem() {

    this.db.removeFood(this.detailItem._id).pipe(take(1)).subscribe(
      (success) => {
        this.toast.success('Food item removed successfully!');
        this.search();
      },
      (error) => {
        this.toast.error('Failed to remove food item!');
      }
    );

  }

  removeExerciseItem() {

    this.db.removeExercise(this.detailItem._id).pipe(take(1)).subscribe(
      (success) => {
        this.toast.success('Exercise item removed successfully!');
        this.search();
      },
      (error) => {
        this.toast.error('Failed to remove exercise item!');
      }
    );

  }

  private updateStats() {
    const cico: number = this.totalCalFromFood - (this.totalCalFromBase + this.totalCalFromExercise);
    this.db.saveStats(this.totalCalFromFood, this.totalCalFromExercise, this.totalCalFromBase, cico).pipe(
      finalize(() => { this.initStatUpdateCheck(); }),
      debounceTime(400),
      take(1)
    ).subscribe(
      (success) => {
        console.log('user stats updated');
      },
      (error) => {
        this.toast.error('Failed to update daily stats.');
      }
    );
  }

  private updateTitle() {
    this.dateTitle = moment(this.currentDay).format('dddd - MMM D, YYYY');
  }

  private initStatUpdateCheck() {
    this.statUpdater.next(this.statUpdater.getValue() + 1);
  }


  private getFood() {

    this.hasFood = false;

    this.db.getFood(this.currentDay.toString()).pipe(
      finalize(() => { this.initStatUpdateCheck(); }),
      debounceTime(400),
      take(1)
    ).subscribe(
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
            if (hour > 3 && hour <= 11) {
              this.meals.breakfast.push(item);
            } else if (hour <= 3 || hour > 16) {
              this.meals.dinner.push(item);
            } else {
              this.meals.lunch.push(item);
            }

          });

          this.hasFood = true;

        } else {
          this.hasFood = false;
        }
      },
      (error) => {
        this.toast.error('Failed to load food for current day.');
      }
    );

  }

  private getExercise() {

    this.hasExercise = false;

    this.db.getExercise(this.currentDay.toString()).pipe(
      finalize(() => { this.initStatUpdateCheck(); }),
      debounceTime(400),
      take(1)
    ).subscribe(
      (success) => {

        if (Array.isArray(success) && success.length > 0) {

          this.exercise = success;

          success.forEach((item) => {

            this.totalCalFromExercise += (item.calPerMin * item.duration);

          });

          this.hasExercise = true;

        } else {
          this.hasExercise = false;
        }
      },
      (error) => {
        this.toast.error('Failed to load exercise for current day.');
        this.hasExercise = false;
      }
    );

  }

}
