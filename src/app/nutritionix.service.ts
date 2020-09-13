import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { debounceTime, take } from 'rxjs/operators';

  // DOCUMENTATION: https://docs.google.com/document/d/1_q-K-ObMTZvO0qUEAxROrN3bwMujwAN25sLHwJzliK0/edit#
  // DOCUMENTATION: https://docs.google.com/document/d/1_q-K-ObMTZvO0qUEAxROrN3bwMujwAN25sLHwJzliK0/edit#
  // DOCUMENTATION: https://docs.google.com/document/d/1_q-K-ObMTZvO0qUEAxROrN3bwMujwAN25sLHwJzliK0/edit#

@Injectable({
  providedIn: 'root'
})
export class NutritionixService {

  private baseUrl = 'https://trackapi.nutritionix.com/v2/';
  private apiHeaders: HttpHeaders = new HttpHeaders({
    'x-app-id': '97a5666b',
    'x-app-key': '0837e50acb247c93d000dd3787f315fe'
  });
  private options = {
    headers: this.apiHeaders
  }

  constructor(private http: HttpClient) { }

  // Populate any search interface, including autocomplete, with common foods and branded foods from Nutritionix.
  autoComplete(query: string): Observable<any> {

    const url: string = this.baseUrl + 'search/instant';
    const body: any = {
      query
    };

    return this.callApi(url, body);

  }

  // Get detailed nutrient breakdown of any natural language text.
  commonItemByFoodName(foodName: string): Observable<any> {
    const url: string = this.baseUrl + 'natural/nutrients';
    const body: any = {
      query: foodName
    };
    return this.callApi(url, body);
  }

  // Get detailed nutrient breakdown of any natural language text.
  brandedItemById(id: string): Observable<any> {
    const url: string = this.baseUrl + `search/item?nix_item_id=${id}`;
    return this.callApi(url);
  }

  // Estimate calories burned for various exercises using natural language i.e. "ran 3 miles".
  exercise(query: string): Observable<any> {
    const url: string = this.baseUrl + 'natural/exercise';
    const body: any = {
      query,
      gender: 'male',
      weight_kg: 72.5,
      height_cm: 167.64,
      age: 32
    };
    return this.callApi(url, body);
  }

  private callApi(url, body = null): Observable<any> {
    if (body) {
      return this.http.post(url, body, this.options);
    } else {
      return this.http.get(url, this.options);
    }
  }

}