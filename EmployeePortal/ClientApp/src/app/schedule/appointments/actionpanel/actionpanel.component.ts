
import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActionPanelService } from '../../../services/actionpanel.service';

@Component({
  selector: 'app-actionpanel',
  templateUrl: './actionpanel.component.html',
  styleUrls: ['./actionpanel.component.less']
})
export class ActionPanelComponent implements OnInit {

  visible = true;
  actionPanelOpened = true;

  constructor(private actionpanelService: ActionPanelService) {}

  ngOnInit() {
  }

}
