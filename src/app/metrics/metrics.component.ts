import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit {

  showModal = false;
  saving = false;

  metrics = {
    weight: null,
    goal: null,
    height: null,
    activity: null,
    dob: null
  };

  constructor() { }

  ngOnInit(): void {
  }

  toggleModal(state: boolean) {
    this.showModal = state;
    if (!state) {
    }
  }

  save() {

  }

  search() {

  }

}
