import { Component } from '@angular/core';
import { FbService } from './fb.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector: 'app-fb-pages',
    templateUrl: 'fb-pageSearch.component.html',
    styleUrls: ['fb-pageSearch.component.css'],
    preserveWhitespaces: false,
})
export class FbPageSearchComponent {

    constructor(private fbService: FbService, private route: ActivatedRoute, private router: Router) {}

    selectedFbObject = [];

    pageObject = {
        name: '',
        id: ''
    };

    search() {
        this.fbService.getPageSearch(this.pageObject.name);
    }

    getRecentPosts() {
        this.fbService.getRecentPosts(this.pageObject.id);
    }

    addItemToList(obj) {
        this.selectedFbObject.push(obj);
    }

    removeItemFromList(obj) {
        const index = this.selectedFbObject.map(it => it.id).indexOf(obj.id);
        this.selectedFbObject.splice(index, 1);
    }

    analyze() {
        this.router.navigate(['/graphview', this.selectedFbObject.map(obj => obj.id).join(',') ]);
    }
}
