import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.less']
})
export class CatalogueComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
}
