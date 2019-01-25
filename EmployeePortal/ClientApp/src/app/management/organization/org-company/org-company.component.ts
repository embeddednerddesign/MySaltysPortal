import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Company } from '../../../models/company';
import { Address } from '../../../models/address';
import { CompanyService } from '../../../services/company.service';
import { ValidationService } from '../../../services/validation.service';
import { GeographyService } from '../../../services/geography.service';
import { FormatterService } from '../../../services/formatter.service';
import { AddressService } from '../../../services/address.service';

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
  addressAddress1: FormControl;
  addressAddress2: FormControl;
  addressCity: FormControl;
  addressCountry: FormControl;
  addressPostalCode: FormControl;
  addressProvince: FormControl;
  contactName: FormControl;
  contactPhone: FormControl;
  logo: FormControl;

  isNew: boolean;

  selectedCompany: Company;
  editedCompany: Company;

  countriesOfTheWorld: string[] = [];
  provincesAndStates: string[] = [];
  timezonesOfTheWorld: string[] = [];

  submitButtonDisabledState = false;

  unsub: Subject<void> = new Subject<void>();

  defaultAddress: Address = {
    address1: '',
    address2: '',
    city: '',
    province: 'British Columbia',
    country: 'Canada',
    postalCode: ''
  };

  constructor(
    private companyService: CompanyService,
    private addressService: AddressService,
    private geographyService: GeographyService,
    public validationService: ValidationService,
    public formatterService: FormatterService,
    private router: Router,
  ) {
    this.companyId = new FormControl();
    this.name = new FormControl();
    this.addressAddress1 = new FormControl();
    this.addressAddress2 = new FormControl();
    this.addressCity = new FormControl();
    this.addressCountry = new FormControl();
    this.addressPostalCode = new FormControl('', null);
    this.addressProvince = new FormControl();
    this.contactName = new FormControl();
    this.contactPhone = new FormControl('', this.validationService.validatePhoneNumber);
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
    this.selectedCompany = this.initCompany(this.selectedCompany, this.defaultAddress);
    this.editedCompany = this.initCompany(this.editedCompany, this.defaultAddress);
    if (this.companyIdParam == null) {
      this.isNew = true;
      if (this.countriesOfTheWorld.includes('Canada')) {
        this.selectedCompany.address.country = this.countriesOfTheWorld[this.countriesOfTheWorld.indexOf('Canada')];
        this.editedCompany.address.country = this.countriesOfTheWorld[this.countriesOfTheWorld.indexOf('Canada')];
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
          this.updateProvincesStates();
          this.updateSubmitButtonState();
          this.isNew = false;
          this.loading = false;
        }
      });
    }
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

  updateCompany() {
    this.loading = true;
    if (this.isNew) {
      this.companyService.addCompany(this.editedCompany).subscribe(() => {
        this.refreshData();
      });
    } else {
      this.companyService.updateCompany(this.editedCompany).subscribe(() => {
        this.addressService.updateAddress(this.editedCompany.address).subscribe(() => {
          this.refreshData();
        });
      });
    }
  }

  cancelUpdate() {
    this.refreshData();
    this.router.navigate(['/administration/organization/company', { outlets: { 'action-panel': null } }]);
  }

  onBasicUpload(event: any) {}

  initCompany(thecompany: Company, theaddress: Address) {
    thecompany = {
      companyId: 0,
      name: '',
      address: theaddress,
      contactName: '',
      contactPhone: '',
      timezone: ''
    };
    return thecompany;
  }
}

function formatTime(t: Date): string {
  t = t ? new Date(Date.parse(t.toString())) : null;
  return t ? t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';
}
