import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Patient } from '../../../models/patient';
import { Subject } from 'rxjs/Subject';
import { ValidationService } from '../../../services/validation.service';

@Component({
  selector: 'app-patient-chart-tab',
  templateUrl: './patient-chart-tab.component.html',
  styleUrls: ['./patient-chart-tab.component.less']
})
export class PatientChartTabComponent implements OnInit, AfterViewInit, OnDestroy {

  patientPanelVisible = false;
  addOrEdit = 'Add';
  loading = false;
  disableGrid = false;

  // boolean choices
  boolChoices: string[] = [
    'Yes',
    'No'
  ]

  patientIdParam: string;
  clientId: FormControl;
  firstName: FormControl;
  lastName: FormControl;
  nickname: FormControl;
  birthDate: FormControl;
  gender: FormControl;
  addressAddress1: FormControl;
  addressAddress2: FormControl;
  addressCity: FormControl;
  addressCountry: FormControl;
  addressPostalCode: FormControl;
  addressProvince: FormControl;
  mobileNumber: FormControl;
  email: FormControl;
  isPreferred: FormControl;
  isNew: boolean;
  panelOpenState: boolean = false;


  selectedPatient: Patient;
  editedPatient: Patient;

  countriesOfTheWorld: string[] = [];
  provincesAndStates: string[] = [];

  submitButtonDisabledState: boolean = false;

  unsub: Subject<void> = new Subject<void>();

  constructor(private validationService: ValidationService) {
    this.clientId = new FormControl();
    this.firstName = new FormControl();
    this.lastName = new FormControl();
    this.nickname = new FormControl();
    this.birthDate = new FormControl('', this.validationService.validateDate);
    this.gender = new FormControl();
    this.addressAddress1 = new FormControl();
    this.addressAddress2 = new FormControl();
    this.addressCity = new FormControl();
    this.addressCountry = new FormControl();
    this.addressPostalCode = new FormControl('', null);
    this.addressProvince = new FormControl();
    this.mobileNumber = new FormControl('', this.validationService.validatePhoneNumber);
    this.email = new FormControl('', [Validators.email]);
    this.isPreferred = new FormControl();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  hexToTranslucentRgbA(hex): string {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      // tslint:disable-next-line:no-bitwise
      const rgba = 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ', 0.1)';
      return rgba;
    } else if (hex === 'red') {
      return this.hexToTranslucentRgbA('#FF3F3F');
    } else if (hex === 'blue') {
      return this.hexToTranslucentRgbA('#3F3FFF');
    } else if (hex === 'green') {
      return this.hexToTranslucentRgbA('#3F9F3F');
    } else {
      return 'rgba(0,0,0,0)';
    }
  }
}
