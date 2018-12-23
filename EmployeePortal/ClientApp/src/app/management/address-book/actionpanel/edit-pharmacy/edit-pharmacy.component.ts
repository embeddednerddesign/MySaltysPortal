import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { EventsService } from '../../../../services/events.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Pharmacy } from '../../../../models/pharmacy';
import { Subject } from 'rxjs/Subject';
import { CatalogueUpdatesService } from '../../../../services/catalogueupdates.service';
import { Address } from '../../../../models/address';
import { PharmaciesService } from '../../../../services/pharmacies.service';
import { GeographyService } from '../../../../services/geography.service';
import { ValidationService } from '../../../../services/validation.service';
import { MatDialog } from '@angular/material/dialog';
import { HoursOfOperationDialogComponent } from '../../../dialogs/hours-of-operation/hours-of-operation.component';
import { HoursOfOperation } from '../../../../models/hoursofoperation';
// import { HoursOfOperationService } from '../../../../services/hoursofoperation.service';
import { FormatterService } from '../../../../services/formatter.service';

@Component({
  selector: 'app-edit-pharmacy',
  templateUrl: './edit-pharmacy.component.html',
  styleUrls: ['./edit-pharmacy.component.less']
})
export class EditPharmacyComponent implements OnInit, AfterViewInit, OnDestroy {
  editPharmacyPanelVisible = false;
  addOrEdit = 'Add';

  pharmacyIdParam: string;

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
  isNew: boolean;

  selectedPharmacy: Pharmacy;
  editedPharmacy: Pharmacy;
  selectedAddress: Address;
  editedAddress: Address;

  countriesOfTheWorld: string[] = [];
  provincesAndStates: string[] = [];

  submitButtonDisabledState: boolean = false;

  unsub: Subject<void> = new Subject<void>();

  constructor(
    private pharmaciesService: PharmaciesService,
    private catalogueUpdatesService: CatalogueUpdatesService,
    private geographyService: GeographyService,
    public validationService: ValidationService,
    public formatterService: FormatterService,
    // private hoursOfOperationService: HoursOfOperationService,
    private route: ActivatedRoute,
    private router: Router,
    private hoursOfOperationDialog: MatDialog
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
  }

  ngOnInit() {
    for (let key in this.geographyService.countriesByName()) {
      this.countriesOfTheWorld.push(key);
    }
    this.selectedPharmacy = this.initPharmacy(this.selectedPharmacy, this.selectedAddress);
    this.editedPharmacy = this.initPharmacy(this.editedPharmacy, this.editedAddress);

    this.isNew = true;
    this.addOrEdit = 'Add';
    // TODO: Need to fill with actual Clinic country info
    const clinicCountry = 'Canada';
    const clinicProvince = 'British Columbia';
    this.route.params.takeUntil(this.unsub).subscribe(params => {
      this.pharmacyIdParam = params['pharmid'];
      if (this.pharmacyIdParam !== '_' && this.pharmacyIdParam != null) {
        this.pharmaciesService.getPharmacyById(this.pharmacyIdParam).subscribe(snapshot => {
          this.selectedPharmacy = snapshot as Pharmacy;
          this.editedPharmacy = snapshot as Pharmacy;
          this.updateProvincesStates();
          this.updateSubmitButtonState();
          this.isNew = false;
          this.addOrEdit = 'Edit';
        });
      } else {
        if (this.countriesOfTheWorld.includes(clinicCountry)) {
          this.selectedPharmacy.address.country = this.countriesOfTheWorld[this.countriesOfTheWorld.indexOf(clinicCountry)];
          this.editedPharmacy.address.country = this.countriesOfTheWorld[this.countriesOfTheWorld.indexOf(clinicCountry)];
        } else {
          this.selectedPharmacy.address.country = 'Canada';
          this.editedPharmacy.address.country = 'Canada';
        }
        this.updateProvincesStates();
        if (this.provincesAndStates.includes(clinicProvince)) {
          this.selectedPharmacy.address.province = this.provincesAndStates[this.provincesAndStates.indexOf(clinicProvince)];
          this.editedPharmacy.address.province = this.provincesAndStates[this.provincesAndStates.indexOf(clinicProvince)];
        } else {
          this.selectedPharmacy.address.province = 'British Columbia';
          this.editedPharmacy.address.province = 'British Columbia';
        }
      }
    });
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  onChangeCountry() {
    this.updateProvincesStates();
    this.addressPostalCode.setValue('');
  }

  updateProvincesStates() {
    this.provincesAndStates = this.geographyService.updateProvinceStateList(this.editedPharmacy.address.country);
    if (this.editedPharmacy.address.country.toLowerCase() == 'canada') {
      this.addressPostalCode.validator = this.validationService.validatePostalCode;
    } else if (this.editedPharmacy.address.country.toLowerCase() == 'united states') {
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

  openHoursOfOperationDialog(): void {
    var hoursObj: HoursOfOperation;
    hoursObj = this.editedPharmacy.hoursOfOperation;
    const dialogRef = this.hoursOfOperationDialog.open(HoursOfOperationDialogComponent, {
      width: '600px',
      height: '300px',
      data: {
        hoursOfOp: hoursObj.hoursOfOperationDays
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.editedPharmacy.hoursOfOperation = result;
    });
  }

  updatePharmacy() {
    if (this.isNew) {
      this.pharmaciesService.addPharmacy(this.editedPharmacy).subscribe(() => {
        this.catalogueUpdatesService.refreshRequired = true;
        this.catalogueUpdatesService.catalogueUpdateComplete();
        this.router.navigate(['/management/address-book/pharmacies', { outlets: { 'action-panel': null } }]);
      });
    } else {
      this.pharmaciesService.updatePharmacy(this.editedPharmacy).subscribe(() => {
        this.catalogueUpdatesService.refreshRequired = true;
        this.catalogueUpdatesService.catalogueUpdateComplete();
        this.router.navigate(['/management/address-book/pharmacies', { outlets: { 'action-panel': null } }]);
      });
    }
  }

  cancelUpdate() {
    this.catalogueUpdatesService.refreshRequired = false;
    this.catalogueUpdatesService.catalogueUpdateComplete();
    this.router.navigate(['/management/address-book/pharmacies', { outlets: { 'action-panel': null } }]);
  }

  initPharmacy(pharmacy: Pharmacy, address: Address) {
    address = {
      address1: '',
      address2: '',
      city: '',
      country: 'Canada',
      postalCode: '',
      province: 'British Columbia'
    };
    pharmacy = {
      pharmacyId: 0,
      name: '',
      address: address,
      phoneNumber1: '',
      phoneNumber2: '',
      phoneNumber3: '',
      faxNumber: '',
      email: '',
      website: '',
      hoursOfOperation: null
    };
    return pharmacy;
  }
}
