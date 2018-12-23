import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.less']
})
export class AddressBookComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
}
