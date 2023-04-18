import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot({
      mode: 'md' // # set by reazul it will needed if need only android layout for all device
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
