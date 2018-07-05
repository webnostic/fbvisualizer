import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Subject } from 'rxjs/Rx';
import { MatSnackBar } from '@angular/material';
import { AuthService } from './auth.service';

@Injectable()
export class FbService {

    BASE_URL = 'http://localhost:4321/fb/';

    private messageStore = [];
    private analysisDataStore = [];
    private searchStore = [];

    private messageSubject = new Subject();
    private analysisDataSubject = new Subject();
    private searchSubject = new Subject();

    messages = this.messageSubject.asObservable();
    analysisData = this.analysisDataSubject.asObservable();
    searches = this.searchSubject.asObservable();

    constructor(private http: Http, private sb: MatSnackBar, private auth: AuthService) {
        // this.getMessages('');
    }

    // getMessages(user) {
    //     user = (user) ? '/' + user : '';
    //     this.http.get(this.BASE_URL + '/messages' + user)
    //     .subscribe(
    //         (response) => {
    //             this.messageStore = response.json();
    //             this.messageSubject.next(this.messageStore);
    //         },
    //         (error) => {
    //             this.handleError('Unable to get messages');
    //         });
    // }

    getPageSearch(pageName) {
        return this.http.get(this.BASE_URL + 'searchPages/' + pageName)
        .subscribe(
            (response) => {
                this.searchStore = response.json()['data'];
                this.searchSubject.next(this.searchStore);
            },
            (error) => {
                this.handleError('Unable to post message');
            });
    }

    getRecentPosts(pageId) {
        return this.http.get(this.BASE_URL + 'pagePosts/' + pageId)
        .subscribe(
            (response) => {
                this.messageStore = response.json()['posts']['data'];
                this.messageSubject.next(this.messageStore);
            },
            (error) => {
                this.handleError('Unable to post message');
            });
    }

    analyzeRecentPosts(idsParam) {
        this.analysisDataStore = [];
        const pageIds = idsParam.split(',');
        for (let i = 0; i < pageIds.length; i++ ) {
            this.http.get(this.BASE_URL + 'analyzepage/' + pageIds[i])
                .subscribe(
                    (response) => {
                        this.analysisDataStore.push(response.json());
                        this.analysisDataSubject.next(this.analysisDataStore);
                    },
                    (error) => {
                        this.handleError('Unable to post message');
                    });
        }
    }

    // getUser() {
    //     return this.http.get(this.BASE_URL + '/users/me', this.auth.tokenHeader).map(res => res.json());
    // }

    // saveUser(userData) {
    //     return this.http.post(this.BASE_URL + '/users/me', userData, this.auth.tokenHeader).map(res => res.json());
    // }

    private handleError(error) {
        console.error(error);
        this.sb.open(error, 'close', {duration: 9000});
    }
}
