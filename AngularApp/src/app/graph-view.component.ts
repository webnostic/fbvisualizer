import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { NavComponent} from './nav.component';
import APP_CONFIG from './app.config';
import { Node, Link } from './d3';
import { FbService } from './fb.service';

@Component({
  selector: 'app-graphview',
  template: `
              <div *ngFor="let pageSentiment of fbData">
                <app-d3-barchart [graphModel]="pageSentiment"></app-d3-barchart>
              </div>
              <d3-graph [nodes]="nodes" [links]="links"></d3-graph>
            `
})

export class GraphViewComponent {
    nodes: Node[] = [];
    links: Link[] = [];

    private fbData;
    facebookIds$: Observable<string>;

    private FB_OBJECTS_COUNT = 0;
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private service: FbService) {}


    ngOnInit() {
      // this.facebookIds$ = this.route.paramMap
      //   .switchMap(
      //     (params: ParamMap) =>{
      //       console.log(params.get('facebookids'));
      //       this.service.analyzeRecentPosts(params.get('facebookids'));
      //   });

      this.service.analysisData.subscribe( (pageData: Array<any>) => {
        if (pageData.length === this.FB_OBJECTS_COUNT) {
            const pageSentiments = []; // for n recent posts
            for (let i = 0; i < pageData.length; i++) {
              let pageId = '',
                  pageTotalAngry = 0,
                  pageTotalHaha = 0,
                  pageTotalLike = 0,
                  pageTotalLove = 0,
                  pageTotalSad = 0,
                  pageTotalThankful = 0,
                  pageTotalWow = 0;

              for (const key in pageData[i]) {
                  if (pageData[i].hasOwnProperty(key)) {
                      pageTotalAngry +=       (pageData[i][key]['angry']['summary']['total_count']);
                      pageTotalHaha +=        (pageData[i][key]['haha']['summary']['total_count']);
                      pageTotalLike +=        (pageData[i][key]['like']['summary']['total_count']);
                      pageTotalLove +=        (pageData[i][key]['love']['summary']['total_count']);
                      pageTotalSad +=         (pageData[i][key]['sad']['summary']['total_count']);
                      pageTotalThankful +=    (pageData[i][key]['thankful']['summary']['total_count']);
                      pageTotalWow +=         (pageData[i][key]['wow']['summary']['total_count']);
                      const postId: string = pageData[i][key]['id'];
                      pageId = postId.substring(0, postId.indexOf('_'));
                  }
              }

              pageSentiments.push(
                { 'id': pageId,
                  sentiments: [
                    { sentiment: 'angry', count : pageTotalAngry / 10},
                    { sentiment: 'haha', count: pageTotalHaha / 10},
                    { sentiment: 'like', count: pageTotalLike / 10},
                    { sentiment: 'love', count: pageTotalLove / 10},
                    { sentiment: 'sad', count: pageTotalSad / 10},
                    { sentiment: 'thankful', count: pageTotalThankful / 10},
                    { sentiment: 'wow', count: pageTotalWow / 10}]
                });
            }
          this.fbData = pageSentiments;
        }
      });

      this.route.paramMap.subscribe((params) => {
        this.FB_OBJECTS_COUNT = params.get('facebookids').split(',').length;
        this.service.analyzeRecentPosts(params.get('facebookids'));
      });

      const N = APP_CONFIG.N,
      getIndex = number => number - 1;

      /** constructing the nodes array */
      for (let i = 1; i <= N; i++) {
        this.nodes.push(new Node(i));
      }

      for (let i = 1; i <= N; i++) {
        for (let m = 2; i * m <= N - 1; m++) {
          /** increasing connections toll on connecting nodes */
          this.nodes[getIndex(i)].linkCount++;
          this.nodes[getIndex(i * m)].linkCount++;

          /** connecting the nodes before starting the simulation */
          this.links.push(new Link(i, i * m));
        }
      }

    }


  }
