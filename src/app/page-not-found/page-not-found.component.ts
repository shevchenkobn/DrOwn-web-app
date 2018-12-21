import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {
  public path: string | null = null;

  constructor(route: ActivatedRoute) {
    route.url.subscribe(value => {
      this.path = value.join('/');
    });
  }

  ngOnInit() {
  }

}
