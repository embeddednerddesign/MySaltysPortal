import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.less']
})
export class OrganizationComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

}
