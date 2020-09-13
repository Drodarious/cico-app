import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddItemComponent } from './add-item/add-item.component';
import { NgMaterialIconModule } from 'ng-material-icon';
import { DebounceModule } from 'ngx-debounce';
import { FormsModule, NgModel } from '@angular/forms';
import { ToastMessageComponent } from './toast-message/toast-message.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { UserLogComponent } from './user-log/user-log.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { TrendChartComponent } from './trend-chart/trend-chart.component';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [
    AppComponent,
    AddItemComponent,
    ToastMessageComponent,
    UserLogComponent,
    TrendChartComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgMaterialIconModule,
    DebounceModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    BrowserAnimationsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  providers: [NgModel],
  bootstrap: [AppComponent]
})
export class AppModule { }
