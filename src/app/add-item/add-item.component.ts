import { Component, OnInit, Output } from '@angular/core';
import { NutritionixService } from '../nutritionix.service';
import { debounceTime, take, debounce } from 'rxjs/operators';
import { DatabaseService } from '../database.service';
import { ToastMessageService } from '../toast-message.service';
import { BehaviorSubject } from 'rxjs';

export enum searchTypes {
  FOOD = 'food',
  EXERCISE = 'exercise'
}

export class CalculatedNutrient {
  name: string;
  value: number;
  attrId: number;
}

export class UserFoodInput {
  food: any;
  amount: number;
  unit: string;
}

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {

  @Output() itemAdded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  searchTypes = searchTypes;

  showModal = false;
  searchType: searchTypes = null;
  searchQuery = '';
  rows: any[] = [];
  preview: any = null;
  userFoodInput: UserFoodInput = new UserFoodInput();
  updating = false;

  calculatedNutrients: CalculatedNutrient[] = [
    { name: 'calories', value: 0, attrId: 208 },
    { name: 'carbs', value: 0, attrId: 205 },
    { name: 'fat', value: 0, attrId: 204 },
    { name: 'protein', value: 0, attrId: 203 },
    { name: 'sugar', value: 0, attrId: 269 },
    { name: 'sodium', value: 0, attrId: 307 },
    { name: 'fiber', value: 0, attrId: 291 },
    { name: 'caffeine', value: 0, attrId: 262 }
  ];

  constructor(
    private nutritionix: NutritionixService,
    private db: DatabaseService,
    private toast: ToastMessageService
  ) { }

  ngOnInit(): void {}

  toggleModal(state: boolean) {
    this.showModal = state;
    if (!state) {
      this.searchType = null;
      this.rows = [];
      this.preview = null;
      this.userFoodInput.food = null;
      this.updating = false;
    }
  }

  setSearchType(type: searchTypes) {
    this.searchType = type;
    setTimeout(() => {
      (document.getElementById('searchInput') as HTMLInputElement).focus();
    }, 0);
  }

  search(query: string) {

    if (query.length < 3) { return; }

    this.rows = [];

    if (this.searchType === searchTypes.FOOD) {

      this.nutritionix.autoComplete(query).subscribe(
        (results) => {
          this.rows = results.common.concat(results.branded);
        },
        (error) => {
          console.error('Instant search Failed. Error:' + JSON.stringify(error));
        }
      );

    }

    if (this.searchType === searchTypes.EXERCISE) {
      this.searchExercise(query);
    }
  }

  getFood(row) {
    const isBranded: boolean = row.nix_brand_id;
    if (isBranded) {

      this.nutritionix.brandedItemById(row.nix_item_id).pipe( take(1) ).subscribe(
        (results) => {
          this.userFoodInput = {
            food: this.addNutrients(results.foods[0]),
            amount: results.foods[0].serving_qty,
            unit: results.foods[0].serving_unit
          };
          this.calculateNutrients();
          console.log(this.userFoodInput.food);
        },
        (error) => {
          console.error('Common search Failed. Error:' + JSON.stringify(error));
        }
      );

    } else {

      this.nutritionix.commonItemByFoodName(row.food_name).pipe( take(1) ).subscribe(
        (results) => {
          this.userFoodInput = {
            food: this.addNutrients(results.foods[0]),
            amount: results.foods[0].serving_qty,
            unit: results.foods[0].serving_unit
          };
          this.calculateNutrients();
          console.log(this.userFoodInput.food);
        },
        (error) => {
          console.error('Branded search Failed. Error:' + JSON.stringify(error));
        }
      );

    }
  }

  addNutrients(food) {

    const caffeine = food.full_nutrients.filter((nutrient) => nutrient.attr_id === 262)[0];

    food[`caffeine`] = caffeine ? caffeine.value : 0;

    return food;

  }

  getCalculatedNutrientValue(name: string) {
    return this.calculatedNutrients.filter((nut) => nut.name === name)[0].value;
  }

  saveFoodItem() {
    this.updating = true;

    this.userFoodInput.food.log_display = {
      name: this.userFoodInput.food.food_name,
      amount: this.userFoodInput.amount,
      unit: this.userFoodInput.unit,
      calories: this.calculatedNutrients.find(nut => nut.attrId === 208).value
    };

    this.db.saveFood(this.userFoodInput.food).pipe(take(1)).subscribe(
      (success) => {
        this.toast.success('Food saved successfully!');
        this.updating = false;
        this.toggleModal(false);
        this.itemAdded.next(true);
      },
      (error) => {
        this.toast.error('Failed to save food!');
        this.updating = false;
      }
    );
  }

  calculateNutrients(unit = null, amount = null) {

    if (unit) { this.userFoodInput.unit = unit; }
    if (amount) { this.userFoodInput.amount = amount; }

    if (!this.userFoodInput.food || !this.userFoodInput.unit ||  !this.userFoodInput.amount ) { return; }

    this.calculatedNutrients.forEach((nut) => {
      let defaultNutValue = this.userFoodInput.food.full_nutrients.filter((full) => full.attr_id === nut.attrId)[0];
      defaultNutValue = defaultNutValue ? defaultNutValue.value : 0;
      const defaultWeight: number = this.userFoodInput.food.serving_weight_grams;
      const defaultNutPerUnit = defaultNutValue / defaultWeight;
      const unitsPerMeasure = this.userFoodInput.food.alt_measures.filter((alt) => alt.measure === this.userFoodInput.unit)[0];

      if (unitsPerMeasure) {
        nut.value = Math.round(this.userFoodInput.amount * unitsPerMeasure.serving_weight * defaultNutPerUnit);
      } else {
        nut.value = Math.round(this.userFoodInput.amount * (defaultNutValue / this.userFoodInput.food.serving_qty));
      }
    });
  }

  searchExercise(query: string) {
    // ...
  }

}
