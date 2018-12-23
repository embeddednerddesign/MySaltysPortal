import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Resource } from '../../../../models/resource';
import { CatalogueUpdatesService } from '../../../../services/catalogueupdates.service';
import { ResourcesService } from '../../../../services/resources.service';
import { FormatterService } from '../../../../services/formatter.service';
import { Room } from '../../../../models/room';
import { Tax } from '../../../../models/tax';
import { ClinicsService } from '../../../../services/clinics.service';
import { Clinic, ClinicRoom, ClinicTax } from '../../../../models/clinic';
import { TaxService } from '../../../../services/tax.service';
import { RoomService } from '../../../../services/room.service';
import { GeographyService } from '../../../../services/geography.service';
import { MatDialog } from '@angular/material';
import { ValidationService } from '../../../../services/validation.service';

@Component({
  selector: 'app-edit-clinic',
  templateUrl: './edit-clinic.component.html',
  styleUrls: ['./edit-clinic.component.less']
})
export class EditClinicComponent implements OnInit, AfterViewInit {

  editClinicPanelVisible = false;
  addOrEdit = 'Add';

  clinicIdParam: string;

  name: FormControl;
  addressAddress1: FormControl;
  addressAddress2: FormControl;
  addressCity: FormControl;
  addressCountry: FormControl;
  addressPostalCode: FormControl;
  addressProvince: FormControl;
  rooms: FormControl;
  taxes: FormControl;
  isNew: boolean;

  submitButtonDisabledState: boolean = false;

  countriesOfTheWorld: string[] = [];
  provincesAndStates: string[] = [];

  allRooms: Room[] = [];
  allTaxes: Tax[] = [];
  roomsSelectedStatus: Number[];
  taxesSelectedStatus: Number[];

  public selectedClinic: Clinic;
  public editedClinic: Clinic;

  constructor(private clinicsService: ClinicsService,
    private roomService: RoomService,
    private taxService: TaxService,
    private catalogueUpdatesService: CatalogueUpdatesService,
    public formatterService: FormatterService,
    private geographyService: GeographyService,
    public validationService: ValidationService,
    private hoursOfOperationDialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router) {
    this.name = new FormControl();
    this.addressAddress1 = new FormControl();
    this.addressAddress2 = new FormControl();
    this.addressCity = new FormControl();
    this.addressCountry = new FormControl();
    this.addressPostalCode = new FormControl('', null);
    this.addressProvince = new FormControl();
    this.rooms = new FormControl();
    this.taxes = new FormControl();
}

  ngOnInit() {
    for (let key in this.geographyService.countriesByName()) {
      this.countriesOfTheWorld.push(key);
    }
    this.selectedClinic = this.initClinic(this.selectedClinic);
    this.editedClinic = this.initClinic(this.editedClinic);

    this.isNew = true;
    this.addOrEdit = 'Add';
    const clinicCountry = 'Canada';
    const clinicProvince = 'British Columbia';
    this.route.params.subscribe(params => {
      this.clinicIdParam = params['clinicid'];
      if (this.clinicIdParam !== '_' && this.clinicIdParam != null) {
        this.clinicsService.getClinicById(this.clinicIdParam).subscribe(snapshot => {
          this.selectedClinic = snapshot as Clinic;
          this.editedClinic = snapshot as Clinic;
          this.roomsSelectedStatus = [];

          this.editedClinic.clinicRooms.forEach(element => {
            const localIndex = this.allRooms.find(rm => rm.roomId === element.roomId).roomId;
            this.roomsSelectedStatus.push(localIndex);
          });

          this.taxesSelectedStatus = [];
          this.editedClinic.clinicTaxes.forEach(element => {
            const localIndex = this.allTaxes.find(tx => tx.taxId === element.taxId).taxId;
            this.taxesSelectedStatus.push(localIndex);
          });

          this.updateProvincesStates();
          this.updateSubmitButtonState();

          this.isNew = false;
          this.addOrEdit = 'Edit';
        });
      } else {
        if (this.countriesOfTheWorld.includes(clinicCountry)) {
          this.selectedClinic.address.country = this.countriesOfTheWorld[this.countriesOfTheWorld.indexOf(clinicCountry)];
          this.editedClinic.address.country = this.countriesOfTheWorld[this.countriesOfTheWorld.indexOf(clinicCountry)];
        } else {
          this.selectedClinic.address.country = 'Canada';
          this.editedClinic.address.country = 'Canada';
        }
        this.updateProvincesStates();
        if (this.provincesAndStates.includes(clinicProvince)) {
          this.selectedClinic.address.province = this.provincesAndStates[this.provincesAndStates.indexOf(clinicProvince)];
          this.editedClinic.address.province = this.provincesAndStates[this.provincesAndStates.indexOf(clinicProvince)];
        } else {
          this.selectedClinic.address.province = 'British Columbia';
          this.editedClinic.address.province = 'British Columbia';
        }
      }
    });

    this.roomService.getRooms().subscribe(rooms => {
      rooms.forEach(room => {
        const rm: Room = {
          roomId: room.roomId,
          roomName: room.roomName
        };
        this.allRooms.push(rm);
      });
    });

    this.taxService.getTaxes().subscribe(taxes => {
      taxes.forEach(tax => {
        const tx: Tax = {
          taxId: tax.taxId,
          name: tax.name,
          value: tax.value
        };
        this.allTaxes.push(tx);
      });
    });
  }

  onChangeCountry() {
    this.updateProvincesStates();
    this.addressPostalCode.setValue('');
  }

  updateProvincesStates() {
    this.provincesAndStates = this.geographyService.updateProvinceStateList(this.editedClinic.address.country);
    if (this.editedClinic.address.country.toLowerCase() === 'canada') {
      this.addressPostalCode.validator = this.validationService.validatePostalCode;
    } else if (this.editedClinic.address.country.toLowerCase() === 'united states') {
      this.addressPostalCode.validator = this.validationService.validateZipCode;
    } else {
      this.addressPostalCode.validator = null;
    }
  }

  updateClinicRooms(event) {
    const clinicRooms = [];
    const selectedClinicRoomIds = event.value as Array<Number>;
    this.roomsSelectedStatus = event.value as Array<Number>;
    selectedClinicRoomIds.forEach(element => {
      const fullRoom = this.allRooms.find(rm => rm.roomId === Number(element));
      const clinicRoom = {
        roomId: fullRoom.roomId,
        room: null,
        clinicId: this.editedClinic.clinicId,
        clinic: null
      };
      clinicRooms.push(clinicRoom);
    });
    this.editedClinic.clinicRooms = clinicRooms as ClinicRoom[];
  }

  updateClinicTaxes(event) {
    const clinicTaxes = [];
    const selectedClinicTaxesIds = event.value as Array<Number>;
    this.taxesSelectedStatus = event.value as Array<Number>;
    selectedClinicTaxesIds.forEach(element => {
      const fullTax = this.allTaxes.find(tx => tx.taxId === Number(element));
      const clinicTax = {
        taxId: fullTax.taxId,
        tax: null,
        clinicId: this.editedClinic.clinicId,
        clinic: null
      };
      clinicTaxes.push(clinicTax);
    });
    this.editedClinic.clinicTaxes = clinicTaxes as ClinicTax[];
  }

  updateSubmitButtonState() {
    if (
      (this.addressPostalCode.hasError('postalCodeError') || this.addressPostalCode.hasError('zipCodeError'))
    ) {
      this.submitButtonDisabledState = true;
    } else {
      this.submitButtonDisabledState = false;
    }
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

  updateClinic() {
    if (this.isNew) {
      this.clinicsService.addClinic(this.editedClinic).subscribe(() => {
        this.catalogueUpdatesService.refreshRequired = true;
        this.catalogueUpdatesService.catalogueUpdateComplete();
        this.router.navigate(['/management/organization/clinics', { outlets: { 'action-panel': null } }]);
      });
    }
    else {
      this.clinicsService.updateClinic(this.editedClinic).subscribe(() => {
        this.catalogueUpdatesService.refreshRequired = true;
        this.catalogueUpdatesService.catalogueUpdateComplete();
        this.router.navigate(['/management/organization/clinics', { outlets: { 'action-panel': null } }]);
      });
    }
  }

  cancelUpdate() {
    this.catalogueUpdatesService.refreshRequired = false;
    this.catalogueUpdatesService.catalogueUpdateComplete();
    this.router.navigate(['/management/organization/clinics', { outlets: {'action-panel': null}}]);
  }

  initClinic(clinic: Clinic) {
    clinic = {
      clinicId: 0,
      name: '',
      address: {
        id: 0,
        address1: '',
        address2: '',
        city: '',
        country: '',
        postalCode: '',
        province: ''
      },
      clinicRooms: [],
      clinicTaxes: [],
      companyId: null
    };
    return clinic;
  }
}
