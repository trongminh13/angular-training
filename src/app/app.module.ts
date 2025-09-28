import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';


import { FakeBackendInterceptor } from './core/services/fake-backend';


import { MyDatatableComponent } from './shared/components/my-datatable/my-datatable.component';
import { AccountListComponent } from './features/accounts/account-list/account-list.component';
import { AccountFormComponent } from './features/accounts/account-form/account-form.component';

@NgModule({
  declarations: [
    AppComponent,
    MyDatatableComponent,
    AccountListComponent,
    AccountFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FakeBackendInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
