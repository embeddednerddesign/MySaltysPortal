import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Lab } from '../../../../models/lab';
import { Subject } from 'rxjs/Subject';
import { CatalogueUpdatesService } from '../../../../services/catalogueupdates.service';
import { Address } from '../../../../models/address';
import { LabsService } from '../../../../services/labs.service';
import { MatDialog } from '@angular/material/dialog';
import { HoursOfOperationDialogComponent } from '../../../dialogs/hours-of-operation/hours-of-operation.component';
// import { HoursOfOperationService } from '../../../../services/hoursofoperation.service';
import { GeographyService } from '../../../../services/geography.service';
import { ValidationService } from '../../../../services/validation.service';
import { FormatterService } from '../../../../services/formatter.service';
import { HoursOfOperation } from './../../../../models/hoursofoperation';

@Component({
  selector: 'app-edit-lab',
  templateUrl: './edit-lab.component.html',
  styleUrls: ['./edit-lab.component.less']
})
export class EditLabComponent implements OnInit, AfterViewInit, OnDestroy {
  editLabPanelVisible = false;
  addOrEdit = 'Add';

  labIdParam: string;

  name: FormControl;
  addressAddress1: FormControl;
  addressAddress2: FormControl;
  addressCity: FormControl;
  addressCountry: FormControl;
  addressPostalCode: FormControl;
  addressProvince: FormControl;
  phoneNumber1: FormControl;
  phoneNumber2: FormControl;
  phoneNumber3: FormControl;
  faxNumber: FormControl;
  email: FormControl;
  website: FormControl;
  hoursOfOperation: FormControl;
  labType: FormControl;
  isNew: boolean;

  selectedLab: Lab;
  editedLab: Lab;
  selectedAddress: Address;
  editedAddress: Address;

  countriesOfTheWorld: string[] = [];
  provincesAndStates: string[] = [];

  submitButtonDisabledState: boolean = false;

  unsub: Subject<void> = new Subject<void>();

  constructor(
    private labsService: LabsService,
    private catalogueUpdatesService: CatalogueUpdatesService,
    private route: ActivatedRoute,
    public validationService: ValidationService,
    public formatterService: FormatterService,
    private geographyService: GeographyService,
    private hoursOfOperationDialog: MatDialog,
    private router: Router
  ) {
    this.name = new FormControl();
    this.addressAddress1 = new FormControl();
    this.addressAddress2 = new FormControl();
    this.addressCity = new FormControl();
    this.addressCountry = new FormControl();
    this.addressPostalCode = new FormControl('', null);
    this.addressProvince = new FormControl();
    this.phoneNumber1 = new FormControl('', this.validationService.validatePhoneNumber);
    this.phoneNumber2 = new FormControl('', this.validationService.validatePhoneNumber);
    this.phoneNumber3 = new FormControl('', this.validationService.validatePhoneNumber);
    this.faxNumber = new FormControl('', this.validationService.validatePhoneNumber);
    this.email = new FormControl('', [Validators.email]);
    this.website = new FormControl();
    this.hoursOfOperation = new FormControl();
    this.labType = new FormControl();
  }

  ngOnInit() {
    for (let key in this.geographyService.countriesByName()) {
      this.countriesOfTheWorld.push(key);
    }
    this.selectedLab = this.initLab(this.selectedLab, this.selectedAddress);
    this.editedLab = this.initLab(this.editedLab, this.editedAddress);

    this.isNew = true;
    this.addOrEdit = 'Add';
    // TODO: Need to fill with actual Clinic country info
    const clinicCountry = 'Canada';
    const clinicProvince = 'British Columbia';
    this.route.params.takeUntil(this.unsub).subscribe(params => {
      this.labIdParam = params['labid'];
      if (this.labIdParam !== '_' && this.labIdParam != null) {
        this.labsService.getLabById(this.labIdParam).subscribe(snapshot => {
          this.selectedLab = snapshot as Lab;
          this.editedLab = snapshot as Lab;
          this.updateProvincesStates();
          this.updateSubmitButtonState();
          this.isNew = false;
          this.addOrEdit = 'Edit';
        });
      } else {
        if (this.countriesOfTheWorld.includes(clinicCountry)) {
          this.selectedLab.address.country = this.countriesOfTheWorld[this.countriesOfTheWorld.indexOf(clinicCountry)];
          this.editedLab.address.country = this.countriesOfTheWorld[this.countriesOfTheWorld.indexOf(clinicCountry)];
        } else {
          this.selectedLab.address.country = 'Canada';
          this.editedLab.address.country = 'Canada';
        }
        this.updateProvincesStates();
        if (this.provincesAndStates.includes(clinicProvince)) {
          this.selectedLab.address.province = this.provincesAndStates[this.provincesAndStates.indexOf(clinicProvince)];
          this.editedLab.address.province = this.provincesAndStates[this.provincesAndStates.indexOf(clinicProvince)];
        } else {
          this.selectedLab.address.province = 'British Columbia';
          this.editedLab.address.province = 'British Columbia';
        }
      }
    });
  }

  onChangeCountry() {
    this.updateProvincesStates();
    this.addressPostalCode.setValue('');
  }

  updateProvincesStates() {
    this.provincesAndStates = this.geographyService.updateProvinceStateList(this.editedLab.address.country);
    if (this.editedLab.address.country.toLowerCase() == 'canada') {
      this.addressPostalCode.validator = this.validationService.validatePostalCode;
    } else if (this.editedLab.address.country.toLowerCase() == 'united states') {
      this.addressPostalCode.validator = this.validationService.validateZipCode;
    } else {
      this.addressPostalCode.validator = null;
    }
  }

  updateSubmitButtonState() {
    if (
      (this.email.value !== '' && this.email.hasError('email')) ||
      this.phoneNumber1.hasError('phoneError') ||
      this.phoneNumber2.hasError('phoneError') ||
      this.phoneNumber3.hasError('phoneError') ||
      this.faxNumber.hasError('phoneError') ||
      this.website.hasError('websiteError') ||
      this.addressPostalCode.hasError('postalCodeError') ||
      this.addressPostalCode.hasError('zipCodeError')
    ) {
      this.submitButtonDisabledState = true;
    } else {
      this.submitButtonDisabledState = false;
    }
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  updateLab() {
    if (this.isNew) {
      this.labsService.addLab(this.editedLab).subscribe(() => {
        this.catalogueUpdatesService.refreshRequired = true;
        this.catalogueUpdatesService.catalogueUpdateComplete();
        this.router.navigate(['/management/address-book/labs', { outlets: { 'action-panel': null } }]);
      });
    } else {
      this.labsService.updateLab(this.editedLab).subscribe(() => {
        this.catalogueUpdatesService.refreshRequired = true;
        this.catalogueUpdatesService.catalogueUpdateComplete();
        this.router.navigate(['/management/address-book/labs', { outlets: { 'action-panel': null } }]);
      });
    }
  }

  openHoursOfOperationDialog(): void {
    var hoursObj: HoursOfOperation;
    hoursObj = this.editedLab.hoursOfOperation;
    const dialogRef = this.hoursOfOperationDialog.open(HoursOfOperationDialogComponent, {
      width: '600px',
      height: '300px',
      data: {
        hoursOfOp: hoursObj.hoursOfOperationDays
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.editedLab.hoursOfOperation = result;
    });
  }

  cancelUpdate() {
    this.catalogueUpdatesService.refreshRequired = false;
    this.catalogueUpdatesService.catalogueUpdateComplete();
    this.router.navigate(['/management/address-book/labs', { outlets: { 'action-panel': null } }]);
  }

  initLab(lab: Lab, address: Address) {
    address = {
      address1: '',
      address2: '',
      city: '',
      country: 'Canada',
      postalCode: '',
      province: 'British Columbia'
    };
    lab = {
      labId: 0,
      name: '',
      address: address,
      phoneNumber1: '',
      phoneNumber2: '',
      phoneNumber3: '',
      faxNumber: '',
      email: '',
      website: '',
      hoursOfOperation: null,
      labType: ''
    };
    return lab;
  }
}
