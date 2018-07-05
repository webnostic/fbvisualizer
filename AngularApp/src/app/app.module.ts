import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { MessagesComponent} from './messages.component';
import { NavComponent } from './nav.component';
import { NewMessageComponent} from './new-message.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCardModule, MatInputModule, MatSnackBarModule, MatToolbarModule,
  MatButtonToggleModule, MatListModule, MatSidenavModule, MatIconModule
} from '@angular/material';
import { WebService} from './web.service';
import { FbService } from './fb.service';
import { FbPageSearchComponent } from './fb-pageSearch.component';
import { HttpModule} from '@angular/http';
import { HomeComponent } from './home.component';
import { RegisterComponent } from './register.component';
import { AuthService } from './auth.service';
import { LoginComponent } from './login.component';
import { UserComponent } from './user.component';

import { D3Service, D3_DIRECTIVES } from './d3';
import { GraphComponent } from './visuals/graph/graph.component';
import { SHARED_VISUALS } from './visuals/shared';
import { GraphViewComponent } from './graph-view.component';

import { BarChartComponent } from './visuals/barchart/barchart.component';

const routes = [
  {
    path: 'messages',
    component: MessagesComponent
  },
  {
    path: 'messages/:name',
    component: MessagesComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'user',
    component: UserComponent
  },
  {
    path: 'graphview/:facebookids',
    component: GraphViewComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: '**',
    component: HomeComponent
  }

];

@NgModule({
  declarations: [
    AppComponent, MessagesComponent, NewMessageComponent, NavComponent, HomeComponent, RegisterComponent, LoginComponent, UserComponent,
    FbPageSearchComponent
    , ...D3_DIRECTIVES
    , ...SHARED_VISUALS
    , GraphComponent
    , GraphViewComponent
    , BarChartComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, MatButtonModule, MatCardModule, MatInputModule, MatSnackBarModule,
    MatToolbarModule, MatButtonToggleModule, MatListModule, MatSidenavModule, MatIconModule,
    HttpModule, FormsModule, ReactiveFormsModule, RouterModule.forRoot(routes)
  ],
  providers: [WebService, AuthService, FbService, D3Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
