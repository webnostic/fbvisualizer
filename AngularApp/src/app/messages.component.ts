import { Component } from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-messages',
    template: `
    <div *ngFor="let message of webService.messages | async">
        <mat-card class="card">
            <mat-card-title [routerLink]="['/messages', message.owner]" style="cursor: pointer">{{message.owner}}</mat-card-title>
            <mat-card-content>{{message.text}}</mat-card-content>
        </mat-card>
    </div>
    `
})
export class MessagesComponent {

    constructor(private webService: WebService, private route: ActivatedRoute) {}

    ngOnInit() {
        let name = this.route.snapshot.params.name;
        this.webService.getMessages(name);
        this.webService.getUser().subscribe();

        // added async pipe instead of this at line #8
        // this.webService.messages.subscribe(messages => {
        //     this.messages = messages;
        // });
    }
}
