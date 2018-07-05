import { Component } from '@angular/core';
import { NavComponent} from './nav.component';

@Component({
  selector: 'app-root',
  template: `
        <app-navbar></app-navbar>
        <router-outlet></router-outlet>
        `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {

}
