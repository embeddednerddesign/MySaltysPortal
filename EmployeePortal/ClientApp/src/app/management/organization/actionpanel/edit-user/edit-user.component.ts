import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../../../models/user';
import { UsersService } from '../../../../services/users.service';
import { ValidationService } from '../../../../services/validation.service';
import { Address } from '../../../../models/address';
import { GeographyService } from '../../../../services/geography.service';
import { Subject } from 'rxjs/Subject';
import { FormatterService } from '../../../../services/formatter.service';
import { AddressService } from '../../../../services/address.service';
import { isNullOrUndefined } from 'util';
import { ImageService } from '../../../../services/image.service';
import { CurrentDataService } from '../../../../services/currentData.service';
import { CatalogueUpdatesService } from '../../../../services/catalogueupdates.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.less']
})
export class EditUserComponent implements OnInit, AfterViewInit, OnDestroy {

  selectedFile = null;

  editUserPanelVisible = false;
  addOrEdit = 'Add';

  // boolean choices
  boolChoices: string[] = [
    'Yes',
    'No'
  ];

  userIdParam: string;
  userCategoryParam: string;

  firstName: FormControl;
  lastName: FormControl;

  password: FormControl;
  passwordConfirm: FormControl;

  addressAddress1: FormControl;
  addressAddress2: FormControl;
  addressCity: FormControl;
  addressCountry: FormControl;
  addressPostalCode: FormControl;
  addressProvince: FormControl;
  phoneNumber: FormControl;
  email: FormControl;
  serviceProvider: FormControl;
  avatar: FormControl;
  isNew: boolean;

  selectedUser: User;
  editedUser: User;
  selectedAddress: Address;
  editedAddress: Address;

  countriesOfTheWorld: string[] = [];
  provincesAndStates: string[] = [];
  allUserRoles: string[] = [ 'Leader', 'Partner'];

  submitButtonDisabledState = false;

  unsub: Subject<void> = new Subject<void>();

constructor(private usersService: UsersService,
    private catalogueUpdatesService: CatalogueUpdatesService,
    private imageService: ImageService,
    private geographyService: GeographyService,
    public validationService: ValidationService,
    public formatterService: FormatterService,
    private route: ActivatedRoute,
    private router: Router,
    private addressService: AddressService) {
      this.firstName = new FormControl();
      this.lastName = new FormControl();
      this.addressAddress1 = new FormControl();
      this.addressAddress2 = new FormControl();
      this.addressCity = new FormControl();
      this.addressCountry = new FormControl();
      this.addressPostalCode = new FormControl('', null);
      this.addressProvince = new FormControl();
      this.phoneNumber = new FormControl('', this.validationService.validatePhoneNumber);
      this.email = new FormControl('', [Validators.email]);
      this.serviceProvider = new FormControl();
      this.avatar = new FormControl();
      this.password = new FormControl();
      this.passwordConfirm = new FormControl();
  }

  ngOnInit() {
    for (const key in this.geographyService.countriesByName()) {
      if (key) {
        this.countriesOfTheWorld.push(key);
      }
    }
    this.selectedUser = this.initUser(this.selectedUser, this.selectedAddress);
    this.editedUser = this.initUser(this.editedUser, this.editedAddress);
    this.allUserRoles = [ 'Leader', 'Partner'];

    this.isNew = true;
    this.addOrEdit = 'Add';
    const country = 'Canada';
    this.route.params.subscribe(params => {
      this.userIdParam = params['userid'];
      if (this.userIdParam !== '_' && this.userIdParam != null) {
        this.usersService.getUserById(this.userIdParam).subscribe(snapshot => {
          this.selectedUser = snapshot as User;
          this.editedUser = snapshot as User;
          this.isNew = false;
          this.addOrEdit = 'Edit';
          this.updateProvincesStates();
          this.updateSubmitButtonState();
        });
      } else {
        if (this.countriesOfTheWorld.includes(country)) {
          this.selectedUser.address.country = this.countriesOfTheWorld[this.countriesOfTheWorld.indexOf(country)];
          this.editedUser.address.country = this.countriesOfTheWorld[this.countriesOfTheWorld.indexOf(country)];
        } else {
          this.selectedUser.address.country = 'Canada';
          this.editedUser.address.country = 'Canada';
        }
        this.updateProvincesStates();
        this.submitButtonDisabledState = true;
      }
    });
  }

  ngAfterViewInit() {
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
    this.provincesAndStates = this.geographyService.updateProvinceStateList(this.editedUser.address.country);
    if (this.editedUser.address.country.toLowerCase() === 'canada') {
      this.addressPostalCode.validator = this.validationService.validatePostalCode;
    } else if (this.editedUser.address.country.toLowerCase() === 'united states') {
      this.addressPostalCode.validator = this.validationService.validateZipCode;
    } else {
      this.addressPostalCode.validator = null;
    }
  }

  confirmPasswordMatch() {
    if ((isNullOrUndefined(this.password.value) && isNullOrUndefined(this.passwordConfirm.value)) ||
        (isNullOrUndefined(this.password.value) && this.passwordConfirm.value === '') ||
        (this.password.value === '' && isNullOrUndefined(this.passwordConfirm.value)) ||
        (this.password.value === this.passwordConfirm.value)) {
      this.password.setErrors(null);
      this.passwordConfirm.setErrors(null);
    } else {
      this.password.setErrors({'passwordMatchError': true});
      this.passwordConfirm.setErrors({'passwordMatchError': true});
    }
  }

  updateSubmitButtonState() {
    if (this.addOrEdit === 'Add' && ((isNullOrUndefined(this.password.value) || this.password.value === '')
        && (isNullOrUndefined(this.passwordConfirm.value) || this.passwordConfirm.value === ''))) {
      this.submitButtonDisabledState = true;
    } else {
      if ((this.password.hasError('passwordMatchError')) ||
        (this.passwordConfirm.hasError('passwordMatchError')) ||
        (this.email.value !== '' && this.email.hasError('email')) ||
        (this.phoneNumber.hasError('phoneError')) ||
        (this.addressPostalCode.hasError('postalCodeError')) ||
        (this.addressPostalCode.hasError('zipCodeError'))) {
          this.submitButtonDisabledState = true;
      } else {
        this.submitButtonDisabledState = false;
      }
    }
  }

  updateUser() {
    if (this.isNew) {
      this.usersService.addUser(this.editedUser, this.password.value).subscribe(() => {
        this.catalogueUpdatesService.refreshRequired = true;
        this.catalogueUpdatesService.catalogueUpdateComplete();
        this.router.navigate(['/management/organization/users', { outlets: { 'action-panel': null } }]);
      });
    } else {
      if (this.editedUser.id === this.usersService.loggedInUser.id) {
        this.usersService.loggedInUser = this.editedUser;
        this.usersService.loggedInUserUpdated(this.editedUser);
      }
      this.usersService.updateUser(this.editedUser).subscribe(() => {
        this.catalogueUpdatesService.refreshRequired = true;
        this.catalogueUpdatesService.catalogueUpdateComplete();
        this.router.navigate(['/management/organization/users', { outlets: { 'action-panel': null } }]);
      });
    }
  }

  cancelUpdate() {
    this.catalogueUpdatesService.refreshRequired = false;
    this.catalogueUpdatesService.catalogueUpdateComplete();
    this.router.navigate(['/management/organization/users', { outlets: {'action-panel': null}}]);
  }

  initUser(theuser: User, address: Address) {
    address = {
        address1: '',
        address2: '',
        city: '',
        country: 'Canada',
        postalCode: '',
        province: 'British Columbia'
    };
    theuser = {
      id: '',
      firstName: '',
      lastName: '',
      avatar: '',
      role: 'partner',
      phoneNumber: '',
      // password: '',
      email: '',
      // addressId: address.id,
      address: address
    };
    return theuser;
  }
}
