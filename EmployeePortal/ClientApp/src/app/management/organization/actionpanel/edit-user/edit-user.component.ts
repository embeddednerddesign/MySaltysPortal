import { Component, OnInit, Input, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../../../models/user';
import { CatalogueUpdatesService } from '../../../../services/catalogueupdates.service';
import { UsersService } from '../../../../services/users.service';
import { ValidationService } from '../../../../services/validation.service';
import { Address } from '../../../../models/address';
import { GeographyService } from '../../../../services/geography.service';
import { Subject } from 'rxjs/Subject';
import { TitleCasePipe } from '@angular/common';
import { FormatterService } from '../../../../services/formatter.service';
import { UserCategory } from '../../../../models/user-category';
import { AddressService } from '../../../../services/address.service';
import { takeUntil } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { ImageService } from '../../../../services/image.service';

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
  userCategories: UserCategory[] = [{ userCategoryId: 0, categoryName: '' }];
  allUserRoles: string[] = ['Admin', 'Manager', 'Staff'];

  submitButtonDisabledState = false;

  unsub: Subject<void> = new Subject<void>();

constructor(private usersService: UsersService,
    private imageService: ImageService,
    private catalogueUpdatesService: CatalogueUpdatesService,
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
    this.usersService.getUserCategories().subscribe(resp => {
      const userCats = resp as UserCategory[];
      this.userCategories = [];
      userCats.forEach(userCat => {
        this.userCategories.push(userCat);
      });
    });
    this.selectedUser = this.initUser(this.selectedUser, this.selectedAddress);
    this.editedUser = this.initUser(this.editedUser, this.editedAddress);

    this.isNew = true;
    this.addOrEdit = 'Add';
    // TODO: Need to fill with actual Clinic country info
    const clinicCountry = 'Canada';
    this.route.params.takeUntil(this.unsub).subscribe(params => {
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
        if (this.countriesOfTheWorld.includes(clinicCountry)) {
          this.selectedUser.address.country = this.countriesOfTheWorld[this.countriesOfTheWorld.indexOf(clinicCountry)];
          this.editedUser.address.country = this.countriesOfTheWorld[this.countriesOfTheWorld.indexOf(clinicCountry)];
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
    }
    else {
      this.password.setErrors({'passwordMatchError': true});
      this.passwordConfirm.setErrors({'passwordMatchError': true});
    }
  }

  onAvatarSelectClick() {
    document.getElementById('avatarToUpload').click();
  }
  onAvatarSelected(event) {
    this.selectedFile = event.target.files[0];
    const formData = new FormData();
    formData.append(this.selectedFile.name, this.selectedFile);
    this.editedUser.avatar = this.selectedFile.name;
    this.imageService.uploadUserAvatar(formData).subscribe(res => {});
  }

  updateSubmitButtonState() {
    if (this.addOrEdit === 'Add' && ((isNullOrUndefined(this.password.value) || this.password.value === '')
        && (isNullOrUndefined(this.passwordConfirm.value) || this.passwordConfirm.value === ''))) {
      this.submitButtonDisabledState = true;
    }
    else {
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
      // add address, use the returned address id when adding user
      // const addressToAdd = {
      //   address1: this.addressAddress1.value,
      //   address2: this.addressAddress2.value,
      //   city: this.addressCity.value,
      //   country: this.addressCountry.value,
      //   postalCode: this.addressPostalCode.value,
      //   province: this.addressProvince.value
      // };
      // this.addressService.addAddress(addressToAdd).pipe(takeUntil(this.unsub)).subscribe(address => {
        this.usersService.addUser(this.editedUser, this.password.value).subscribe(() => {
          this.catalogueUpdatesService.refreshRequired = true;
          this.catalogueUpdatesService.catalogueUpdateComplete();
          this.router.navigate(['/management/organization/users', { outlets: { 'action-panel': null } }]);
        });
      // });
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
      role: 'staff',
      phoneNumber: '',
      // password: '',
      email: '',
      // addressId: address.id,
      address: address
    };
    return theuser;
  }
}
