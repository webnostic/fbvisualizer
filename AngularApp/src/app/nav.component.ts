import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
    selector: 'app-navbar',
    template: `
    <mat-toolbar color="primary">
        <button mat-button routerLink="/">Home</button>
        <button mat-button routerLink="/messages">Results</button>
        <span style="flex: 1 1 auto"></span>
        <button *ngIf="!auth.isAuthenticated"mat-button routerLink="/login">Login</button>
        <button *ngIf="!auth.isAuthenticated"mat-button routerLink="/register">Register</button>
        <button *ngIf="auth.isAuthenticated" mat-button routerLink="/user">Welcome {{auth.name}}</button>
        <button *ngIf="auth.isAuthenticated" mat-button (click)="auth.logout()" routerLink="/login">Logout</button>
    </mat-toolbar>
    `
})
export class NavComponent {

    constructor(private auth: AuthService) {}

}
