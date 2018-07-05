import { Component } from '@angular/core';
import { MessagesComponent} from './messages.component';
import { NewMessageComponent} from './new-message.component';
import { NavComponent} from './nav.component';

@Component({
  selector: 'app-home',
  template: `
        <!--
          <app-newmessage></app-newmessage>
          <app-messages></app-messages>
        -->

        <app-fb-pages></app-fb-pages>
        `
})
export class HomeComponent {

}
