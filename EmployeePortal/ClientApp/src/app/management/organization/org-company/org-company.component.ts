import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EventsService } from '../../../services/events.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Subject } from 'rxjs/Subject';
import { Clinic } from '../../../models/clinic';
import { Company } from '../../../models/company';
import { startWith } from 'rxjs/operators';
import { Address } from '../../../models/address';
import { CompanyService } from '../../../services/company.service';
import { ClinicsService } from '../../../services/clinics.service';
import { ValidationService } from '../../../services/validation.service';
import { GeographyService } from '../../../services/geography.service';
import { MatDialog } from '@angular/material/dialog';
import { HoursOfOperationDialogComponent } from '../../dialogs/hours-of-operation/hours-of-operation.component';
import { HoursOfOperation, HoursOfOperationDay } from '../../../models/hoursofoperation';
// import { HoursOfOperationService } from '../../../services/hoursofoperation.service';
import { ConfirmDeleteDialogComponent } from '../../dialogs/confirm-delete/confirm-delete.component';
import { FormatterService } from '../../../services/formatter.service';
import { WeekDay } from '../../../models/week-day';
import { isNull } from 'util';

@Component({
  selector: 'app-org-company',
  templateUrl: './org-company.component.html',
  styleUrls: ['./org-company.component.less']
})
export class EditCompanyComponent implements OnInit, OnDestroy {
  editCompanyPanelVisible = false;
  companyIdParam = 1;

  loading = false;

  companyId: FormControl;
  name: FormControl;
  clinics: FormControl;
  addressAddress1: FormControl;
  addressAddress2: FormControl;
  addressCity: FormControl;
  addressCountry: FormControl;
  addressPostalCode: FormControl;
  addressProvince: FormControl;
  contactName: FormControl;
  contactPhone: FormControl;
  // hoursOfOperation: FormControl;
  primaryColour: FormControl;
  accentColour: FormControl;
  minimumDuration: FormControl;
  logo: FormControl;

  isNew: boolean;

  selectedCompany: Company;
  editedCompany: Company;

  countriesOfTheWorld: string[] = [];
  provincesAndStates: string[] = [];
  timezonesOfTheWorld: string[] = [];

  submitButtonDisabledState = false;

  clinicsunsub: any;
  unsub: Subject<void> = new Subject<void>();
  recentClinics: Clinic[];
  selectedClinic: FormControl = new FormControl();
  allAvailableClinics: Clinic[] = [];
  filteredClinics: Observable<Clinic[]>;
  selectedClinics: Clinic[] = [];

  defaultAddress: Address = {
    address1: '',
    address2: '',
    city: '',
    province: 'British Columbia',
    country: 'Canada',
    postalCode: ''
  };

  clinicToAdd: Clinic = {
    clinicId: null,
    name: '',
    address: null,
    clinicRooms: [],
    clinicTaxes: [],
    companyId: null
  };

  hoursOfOperation = '';

  constructor(
    private eventService: EventsService,
    private companyService: CompanyService,
    private clinicsService: ClinicsService,
    private geographyService: GeographyService,
    public validationService: ValidationService,
    public formatterService: FormatterService,
    // private hoursOfOperationService: HoursOfOperationService,
    private route: ActivatedRoute,
    private router: Router,
    private hoursOfOperationDialog: MatDialog,
    private deleteDialog: MatDialog
  ) {
    this.companyId = new FormControl();
    this.name = new FormControl();
    this.clinics = new FormControl();
    this.addressAddress1 = new FormControl();
    this.addressAddress2 = new FormControl();
    this.addressCity = new FormControl();
    this.addressCountry = new FormControl();
    this.addressPostalCode = new FormControl('', null);
    this.addressProvince = new FormControl();
    this.contactName = new FormControl();
    this.contactPhone = new FormControl('', this.validationService.validatePhoneNumber);
    // this.hoursOfOperation = new FormControl();
    this.primaryColour = new FormControl();
    this.accentColour = new FormControl();
    this.minimumDuration = new FormControl();
    this.logo = new FormControl();
  }

  ngOnInit() {
    // tslint:disable-next-line:forin
    for (const key in this.geographyService.countriesByName()) {
      this.countriesOfTheWorld.push(key);
    }
    // tslint:disable-next-line:forin
    for (const key in this.geographyService.timezonesByName()) {
      this.timezonesOfTheWorld.push(key);
    }
    this.companyIdParam = 1;
    this.primaryColour.disable();
    this.accentColour.disable();
    this.refreshData();
  }

  refreshData() {
    // tslint:disable-next-line:forin
    for (const key in this.geographyService.countriesByName()) {
      this.countriesOfTheWorld.push(key);
    }
    // tslint:disable-next-line:forin
    for (const key in this.geographyService.timezonesByName()) {
      this.timezonesOfTheWorld.push(key);
    }
    this.loading = true;
    this.selectedClinics = [];
    this.selectedCompany = this.initCompany(this.selectedCompany, this.defaultAddress, this.selectedClinics);
    this.editedCompany = this.initCompany(this.editedCompany, this.defaultAddress, this.selectedClinics);
    // TODO: Need to fill with actual Clinic country info
    const clinicCountry = 'Canada';
    if (this.companyIdParam == null) {
      this.isNew = true;
      if (this.countriesOfTheWorld.includes(clinicCountry)) {
        this.selectedCompany.address.country = this.countriesOfTheWorld[this.countriesOfTheWorld.indexOf(clinicCountry)];
        this.editedCompany.address.country = this.countriesOfTheWorld[this.countriesOfTheWorld.indexOf(clinicCountry)];
      } else {
        this.selectedCompany.address.country = 'Canada';
        this.editedCompany.address.country = 'Canada';
      }
      this.updateProvincesStates();
    } else {
      this.companyService.getCompanyById(this.companyIdParam).subscribe(snapshot => {
        if (snapshot != null) {
          this.selectedCompany = snapshot as Company;
          this.editedCompany = snapshot as Company;

          const days = snapshot && snapshot.hoursOfOperation ? snapshot.hoursOfOperation.hoursOfOperationDays : [];
          this.hoursOfOperation = formatHoursOfOperation(days);

          this.selectedCompany.clinics.forEach(c => {
            if (isNull(c.address)) {
              c.address = {
                address1: '',
                address2: '',
                city: '',
                province: '',
                country: '',
                postalCode: ''
              };
            }
            this.selectedClinics.push(c);
          });
          this.updateProvincesStates();
          this.updateSubmitButtonState();
          this.isNew = false;
          this.loading = false;
        }
      });
    }

    this.getAllAvailableClinics();
    this.filteredClinics = this.selectedClinic.valueChanges.pipe(
      startWith(''),
      map(val => this.clinicfilter(val))
    );
  }

  clinicfilter(val: any): Clinic[] {
    if (val.name) {
      return this.allAvailableClinics.filter(option => option.name.toLowerCase().includes(val.name.toLowerCase()));
    } else {
      return this.allAvailableClinics.filter(option => option.name.toLowerCase().includes(val.toLowerCase()));
    }
  }
  clinicDisplayFn(user?: Clinic): string | undefined {
    return user ? user.name : undefined;
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  onChangeCountry() {
    this.updateProvincesStates();
    this.addressPostalCode.setValue('');
  }

  updateProvincesStates() {
    this.provincesAndStates = this.geographyService.updateProvinceStateList(this.editedCompany.address.country);
    if (this.editedCompany.address.country.toLowerCase() === 'canada') {
      this.addressPostalCode.validator = this.validationService.validatePostalCode;
    } else if (this.editedCompany.address.country.toLowerCase() === 'united states') {
      this.addressPostalCode.validator = this.validationService.validateZipCode;
    } else {
      this.addressPostalCode.validator = null;
    }
  }

  updateSubmitButtonState() {
    if (
      this.contactPhone.hasError('phoneError') ||
      this.addressPostalCode.hasError('postalCodeError') ||
      this.addressPostalCode.hasError('zipCodeError')
    ) {
      this.submitButtonDisabledState = true;
    } else {
      this.submitButtonDisabledState = false;
    }
  }

  openHoursOfOperationDialog(): void {
    const buzz = this.editedCompany;

    if (buzz) {
      if (!buzz.hoursOfOperation) {
        buzz.hoursOfOperation = { hoursOfOperationId: 0, hoursOfOperationDays: [] };
      }

      const dialogRef = this.hoursOfOperationDialog.open(HoursOfOperationDialogComponent, {
        width: '800px',
        height: '420px',
        data: {
          companyId: this.editedCompany.companyId,
          buzzHours: buzz.hoursOfOperation
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          buzz.hoursOfOperation = result;
          this.hoursOfOperation = formatHoursOfOperation(result.hoursOfOperationDays);
        }
      });
    }
  }

  addClinicToCompany() {
    if (this.selectedClinic.value && !this.editedCompany.clinics.includes(this.selectedClinic.value)) {
      const clinic: Clinic = this.selectedClinic.value;
      clinic.companyId = this.editedCompany.companyId;
      this.clinicsService.updateClinic(clinic).subscribe(() => {
        this.selectedClinics.push(clinic);
      });
    }
  }

  removeClinicFromCompany(clinicToRemove: Clinic) {
    this.confirmRemoval(clinicToRemove);
  }

  getAllAvailableClinics() {
    this.allAvailableClinics = [];
    this.clinicsService.getClinics().subscribe(clinicSnapshot => {
      if (clinicSnapshot !== undefined && clinicSnapshot !== null) {
        clinicSnapshot.forEach(clinicDoc => {
          this.allAvailableClinics.push(clinicDoc);
        });
      }
    });
  }

  public confirmRemoval(dataItem: Clinic) {
    const dialogRef = this.deleteDialog.open(ConfirmDeleteDialogComponent, {
      width: '250px'
    });

    dialogRef
      .afterClosed()
      .takeUntil(this.unsub)
      .subscribe(result => {
        if (result === 'delete') {
          const dataItemToRemove = {
            clinicId: dataItem.clinicId,
            name: dataItem.name,
            address: dataItem.address,
            addressId: dataItem.addressId,
            clinicRooms: dataItem.clinicRooms,
            clinicTaxes: dataItem.clinicTaxes,
            companyId: null
          };
          this.clinicsService.updateClinic(dataItemToRemove).subscribe(() => {
            this.selectedClinics.splice(this.selectedClinics.findIndex(sc => sc.clinicId === dataItemToRemove.clinicId), 1);
          });
        }
      });
  }

  updateCompany() {
    this.loading = true;
    if (this.isNew) {
      this.companyService.addCompany(this.editedCompany).subscribe(() => {
        this.refreshData();
      });
    } else {
      this.companyService.updateCompany(this.editedCompany).subscribe(() => {
        this.refreshData();
      });
    }
  }

  cancelUpdate() {
    this.refreshData();
    this.router.navigate(['/administration/organization/company', { outlets: { 'action-panel': null } }]);
  }

  onBasicUpload(event: any) {}

  initCompany(thecompany: Company, theaddress: Address, theclinics: Clinic[]) {
    thecompany = {
      companyId: 0,
      name: '',
      address: theaddress,
      clinics: theclinics,
      contactName: '',
      contactPhone: '',
      primaryBrandingColour: '',
      accentBrandingColour: '',
      minimumDuration: 0,
      hoursOfOperation: {
        hoursOfOperationId: 0,
        hoursOfOperationDays: []
      },
      timezone: ''
    };
    return thecompany;
  }
}

function formatHoursOfOperation(days: HoursOfOperationDay[]): string {
  // M 8-5, T 8-5, W 8-5, R 8-5, F 8-5, S 8-5, U 8-5.
  let hours = '';

  if (days) {
    for (let i = 0; i < days.length; i++) {
      const f = formatDay(days[i]);

      if (f) {
        hours = hours ? (hours += `, ${f}`) : f;
      }
    }
  }

  return hours;
}

function formatDay(day: HoursOfOperationDay): string {
  if (day) {
    const abbr = getAbbr(day.dayofweek);
    const openTime = formatTime(day.openTime);
    const closeTime = formatTime(day.closeTime);

    return day.closed ? '' : `${abbr} ${openTime} - ${closeTime}`;
  }

  return '';
}

function formatTime(t: Date): string {
  t = t ? new Date(Date.parse(t.toString())) : null;
  return t ? t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';
}

function getAbbr(dayofweek: string) {
  switch (dayofweek) {
    case WeekDay.Sunday:
      return 'U';

    case WeekDay.Monday:
      return 'M';

    case WeekDay.Tuesday:
      return 'T';

    case WeekDay.Wednesday:
      return 'W';

    case WeekDay.Thursday:
      return 'R';

    case WeekDay.Friday:
      return 'F';

    case WeekDay.Saturday:
      return 'S';

    default:
      return '?';
  }
}
