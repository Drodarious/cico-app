import { NgModule } from '@angular/core';
// import { GoogleApiModule, NG_GAPI_CONFIG } from 'ng-gapi';

const gapiClientConfig = {
  client_id: '288971667494-7ogser0cd783o1iiuq1qd345ntougd5u.apps.googleusercontent.com',
  discoveryDocs: ['https://analyticsreporting.googleapis.com/$discovery/rest?version=v4'],
  ux_mode: 'popup',
  scope: [
      'https://www.googleapis.com/auth/analytics.readonly',
      'https://www.googleapis.com/auth/analytics'
  ].join(' ')
};

@NgModule({
  imports: [
        /*GoogleApiModule.forRoot({
          provide: NG_GAPI_CONFIG,
          useValue: gapiClientConfig
        }),*/
  ]
})
export class AuthModule { }
