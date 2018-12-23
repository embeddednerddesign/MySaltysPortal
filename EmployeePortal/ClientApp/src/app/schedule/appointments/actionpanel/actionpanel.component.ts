
import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { EventsService } from '../../../services/events.service';
import { AppointmentViewModel } from '../../../models/appintment-viewmodel';
import { ServicesService } from '../../../services/services.service';
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
