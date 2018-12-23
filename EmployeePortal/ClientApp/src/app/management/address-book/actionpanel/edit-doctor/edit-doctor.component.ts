import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DoctorsService } from '../../../../services/doctors.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Doctor } from '../../../../models/doctor';
import { Subject } from 'rxjs/Subject';
import { CatalogueUpdatesService } from '../../../../services/catalogueupdates.service';
import { Address } from '../../../../models/address';
import { MatDialog } from '@angular/material/dialog';
import { HoursOfOperationDialogComponent } from '../../../dialogs/hours-of-operation/hours-of-operation.component';
import { HoursOfOperation } from '../../../../models/hoursofoperation';
// import { HoursOfOperationService } from '../../../../services/hoursofoperation.service';
import { ValidationService } from '../../../../services/validation.service';
import { GeographyService } from '../../../../services/geography.service';
import { FormatterService } from '../../../../services/formatter.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-edit-doctor',
  templateUrl: './edit-doctor.component.html',
  styleUrls: ['./edit-doctor.component.less']
})
export class EditDoctorComponent implements OnInit, AfterViewInit, OnDestroy {
  editDoctorPanelVisible = false;
  addOrEdit = 'Add';

  doctorIdParam: string;

  proTitle: FormControl;
  firstName: FormControl;
  lastName: FormControl;
  addressAddress1: FormControl;
  addressAddress2: FormControl;
  addressCity: FormControl;
  addressCountry: FormControl;
  addressPostalCode: FormControl;
  addressProvince: FormControl;
  phoneNumber: FormControl;
  faxNumber: FormControl;
  email: FormControl;
  website: FormControl;
  hoursOfOperation: FormControl;
  specialty: FormControl;
  isNew: boolean;

  selectedDoctor: Doctor;
  editedDoctor: Doctor;
  selectedAddress: Address;
  editedAddress: Address;

  countriesOfTheWorld: string[] = [];
  provincesAndStates: string[] = [];

  submitButtonDisabledState: Boolean = false;

  unsub: Subject<void> = new Subject<void>();

  specialties: string[] = ['GP', 'Dermatologist', 'Cardiologist', 'Pediatrician', 'Surgeon'];

  constructor(
    private doctorsService: DoctorsService,
    private catalogueUpdatesService: CatalogueUpdatesService,
    public validationService: ValidationService,
    public formatterService: FormatterService,
    private geographyService: GeographyService,
    // private hoursOfOperationService: HoursOfOperationService,
    private route: ActivatedRoute,
    private router: Router,
    private hoursOfOperationDialog: MatDialog
  ) {
    this.proTitle = new FormControl();
    this.firstName = new FormControl();
    this.lastName = new FormControl();
    this.addressAddress1 = new FormControl();
    this.addressAddress2 = new FormControl();
    this.addressCity = new FormControl();
    this.addressCountry = new FormControl();
    this.addressPostalCode = new FormControl('', null);
    this.addressProvince = new FormControl();
    this.phoneNumber = new FormControl('', this.validationService.validatePhoneNumber);
    this.faxNumber = new FormControl('', this.validationService.validatePhoneNumber);
    this.email = new FormControl('', [Validators.email]);
    this.website = new FormControl();
    this.hoursOfOperation = new FormControl();
    this.specialty = new FormControl();
  }

  ngOnInit() {
    for (let key in this.geographyService.countriesByName()) {
      this.countriesOfTheWorld.push(key);
    }
    this.selectedDoctor = this.initDoctor(this.selectedDoctor, this.selectedAddress);
    this.editedDoctor = this.initDoctor(this.editedDoctor, this.editedAddress);

    this.isNew = true;
    this.addOrEdit = 'Add';
    // TODO: Need to fill with actual Clinic country info
    const clinicCountry = 'Canada';
    const clinicProvince = 'British Columbia';
    this.route.params.takeUntil(this.unsub).subscribe(params => {
      this.doctorIdParam = params['doctid'];
      if (this.doctorIdParam !== '_' && this.doctorIdParam != null) {
        this.doctorsService.getDoctorById(this.doctorIdParam).subscribe(snapshot => {
          const doc = snapshot as Doctor;
          if (isNullOrUndefined(doc.address)) {
            doc.address = {
              address1: '',
              address2: '',
              city: '',
              country: 'Canada',
              postalCode: '',
              province: 'British Columbia'
            };
          }
          this.selectedDoctor = doc;
          this.editedDoctor = doc;
          this.updateProvincesStates();
          this.updateSubmitButtonState();
          this.isNew = false;
          this.addOrEdit = 'Edit';
        });
      } else {
        if (this.countriesOfTheWorld.includes(clinicCountry)) {
          this.selectedDoctor.address.country = this.countriesOfTheWorld[this.countriesOfTheWorld.indexOf(clinicCountry)];
          this.editedDoctor.address.country = this.countriesOfTheWorld[this.countriesOfTheWorld.indexOf(clinicCountry)];
        } else {
          this.selectedDoctor.address.country = 'Canada';
          this.editedDoctor.address.country = 'Canada';
        }
        this.updateProvincesStates();
        if (this.provincesAndStates.includes(clinicProvince)) {
          this.selectedDoctor.address.province = this.provincesAndStates[this.provincesAndStates.indexOf(clinicProvince)];
          this.editedDoctor.address.province = this.provincesAndStates[this.provincesAndStates.indexOf(clinicProvince)];
        } else {
          this.selectedDoctor.address.province = 'British Columbia';
          this.editedDoctor.address.province = 'British Columbia';
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
    this.provincesAndStates = this.geographyService.updateProvinceStateList(this.editedDoctor.address.country);
    if (this.editedDoctor.address.country.toLowerCase() === 'canada') {
      this.addressPostalCode.validator = this.validationService.validatePostalCode;
    } else if (this.editedDoctor.address.country.toLowerCase() === 'united states') {
      this.addressPostalCode.validator = this.validationService.validateZipCode;
    } else {
      this.addressPostalCode.validator = null;
    }
  }

  updateSubmitButtonState() {
    if (
      (this.email.value !== '' && this.email.hasError('email')) ||
      this.phoneNumber.hasError('phoneError') ||
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

  updateDoctor() {
    if (this.isNew) {
      this.doctorsService.addDoctor(this.editedDoctor).subscribe(() => {
        this.catalogueUpdatesService.refreshRequired = true;
        this.catalogueUpdatesService.catalogueUpdateComplete();
        this.router.navigate(['/management/address-book/doctors', { outlets: { 'action-panel': null } }]);
      });
    } else {
      this.doctorsService.updateDoctor(this.editedDoctor).subscribe(() => {
        this.catalogueUpdatesService.refreshRequired = true;
        this.catalogueUpdatesService.catalogueUpdateComplete();
        this.router.navigate(['/management/address-book/doctors', { outlets: { 'action-panel': null } }]);
      });
    }
  }

  cancelUpdate() {
    this.catalogueUpdatesService.refreshRequired = false;
    this.catalogueUpdatesService.catalogueUpdateComplete();
    this.router.navigate(['/management/address-book/doctors', { outlets: { 'action-panel': null } }]);
  }

  initDoctor(doctor: Doctor, address: Address) {
    address = {
      address1: '',
      address2: '',
      city: '',
      country: 'Canada',
      postalCode: '',
      province: 'British Columbia'
    };
    doctor = {
      doctorId: 0,
      proTitle: 'Dr.',
      firstName: '',
      lastName: '',
      address: address,
      phoneNumber: '',
      faxNumber: '',
      email: '',
      website: '',
      hoursOfOperation: null,
      specialty: ''
    };
    return doctor;
  }

  openHoursOfOperationDialog(): void {
    let hoursObj: HoursOfOperation;
    hoursObj = this.editedDoctor.hoursOfOperation;
    const dialogRef = this.hoursOfOperationDialog.open(HoursOfOperationDialogComponent, {
      width: '600px',
      height: '300px',
      data: {
        hoursOfOp: hoursObj.hoursOfOperationDays
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.editedDoctor.hoursOfOperation = result;
    });
  }
}
