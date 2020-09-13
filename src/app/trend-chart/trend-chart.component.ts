import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

export enum TrendTypes {
  OneDay = 'oneDay',
  FiveDay = 'fiveDay',
  TenDay = 'tenDay'
}

@Component({
  selector: 'app-trend-chart',
  templateUrl: './trend-chart.component.html',
  styleUrls: ['./trend-chart.component.scss']
})
export class TrendChartComponent implements OnInit {
  options: any;
  isLoading = true;

  private stoppers = {
    oneDay: false,
    fiveDay: false,
    tenDay: false
  };

  private avgCalBurned = {
    oneDay: 3500,
    fiveDay: 2000,
    tenDay: 1000
  };

  private currentWeight = 332;
  private goalWeight = 300;
  private totalCalToBurn: number = (this.currentWeight - this.goalWeight) * 3500;

  private xAxisData = [];
  private oneDayData = [];
  private fiveDayData = [];
  private tenDayData = [];

  constructor() {}

  ngOnInit(): void {

    this.options = {
      legend: {
        data: ['1-Day', '5-Day', '10-Day'],
        align: 'left',
      },
      tooltip: {},
      xAxis: {
        silent: false,
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        min: 0,
        offset: -25,
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          name: '1-Day',
          type: 'line',
          data: [],
          itemStyle: {
            color: '#388E3C',
            borderWidth: 4
          },
          label: {
            color: '#388E3C',
          },
          lineStyle: {
            color: '#388E3C',
            width: 2
          },
          areaStyle: {
            color: '#388E3C',
            opacity: 0.3
          },
          animationDelay: (idx) => idx * 10,
          z: 3
        },
        {
          name: '5-Day',
          type: 'line',
          data: [],
          itemStyle: {
            color: '#388E3C',
            borderWidth: 4
          },
          label: {
            color: '#388E3C',
          },
          lineStyle: {
            color: '#388E3C',
            width: 2
          },
          areaStyle: {
            color: '#388E3C',
            opacity: 0.3
          },
          animationDelay: (idx) => idx * 10 + 100,
          z: 2
        },
        {
          name: '10-Day',
          type: 'line',
          data: [],
          itemStyle: {
            color: '#388E3C',
            borderWidth: 4
          },
          lineStyle: {
            color: '#388E3C',
            width: 2
          },
          areaStyle: {
            color: '#388E3C',
            opacity: 0.3
          },
          animationDelay: (idx) => idx * 10 + 100,
          z: 1,
          label: {
            formatter: (a) => a.data / 1000 + 'k',
            show: true,
            position: 'top',
            color: '#388E3C'
          }
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx) => idx * 5,
    };

    this.populateData();
  }

  private populateData() {

    let i = 0;

    this.xAxisData = [this.totalCalToBurn];
    this.oneDayData = [this.totalCalToBurn];
    this.fiveDayData = [this.totalCalToBurn];
    this.tenDayData = [this.totalCalToBurn];

    while ((!this.stoppers.oneDay || !this.stoppers.fiveDay || !this.stoppers.tenDay) && i < 1825) { // 1825 days is 5 years
      i++;
      const nextXAxisMarker: string = moment().add(i, 'days').local().startOf('day').format('MMM. D, Y');

      if (i % 5 === 0) {
        this.xAxisData.push(nextXAxisMarker);
        this.oneDayData.push(this.calcDailyTotal(i, TrendTypes.OneDay));
        this.fiveDayData.push(this.calcDailyTotal(i, TrendTypes.FiveDay));
        this.tenDayData.push(this.calcDailyTotal(i, TrendTypes.TenDay));
      }

    }

    this.options.series[0].data = this.oneDayData;
    this.options.series[1].data = this.fiveDayData;
    this.options.series[2].data = this.tenDayData;
    this.options.xAxis.data = this.xAxisData;

    this.isLoading = false;

  }

  private calcDailyTotal(index, trendType: TrendTypes): number {

    const total: number = this.totalCalToBurn - (index * this.avgCalBurned[trendType]);

    if (total < 0) {
      this.stoppers[trendType] = true;
    }

    return total;

  }

}
