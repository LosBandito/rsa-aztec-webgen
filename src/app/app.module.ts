import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import {HttpClientModule} from "@angular/common/http";
import { EncryptComponent } from './encrypt/encrypt.component';
import { DecryptComponent } from './decrypt/decrypt.component';
import {FormsModule} from "@angular/forms";
import { LoadingComponent } from './loading/loading.component';
import { NavComponent } from './nav/nav.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    EncryptComponent,
    DecryptComponent,
    LoadingComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
