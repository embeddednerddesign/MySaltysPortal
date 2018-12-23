import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Patient } from '../../../models/patient';
import { Subject } from 'rxjs/Subject';
import { ValidationService } from '../../../services/validation.service';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { ImageService } from '../../../services/image.service';
// import * as tui from 'tui-image-editor';
// import * as blackTheme from 'tui-image-editor/examples/js/theme/black-theme.js';
// import { NgxImageEditorModule } from 'ngx-image-editor';

@Component({
  selector: 'app-patient-photos-tab',
  templateUrl: './patient-photos-tab.component.html',
  styleUrls: ['./patient-photos-tab.component.less']
})
export class PatientPhotosTabComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'app';
  selectedFile = null;

  patientPanelVisible = false;
  addOrEdit = 'Add';
  loading = false;
  disableGrid = false;

  // boolean choices
  boolChoices: string[] = [
    'Yes',
    'No'
  ];

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

  selectedPatient: Patient;
  editedPatient: Patient;

  countriesOfTheWorld: string[] = [];
  provincesAndStates: string[] = [];

  submitButtonDisabledState: boolean = false;

  unsub: Subject<void> = new Subject<void>();

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  fullListOfPatientPhotos: string[] = [];
  currentlySelectedPhoto: string = '';

  progress: number;
  message: string;

  public config = {
    ImageName: 'Some image',
    AspectRatios: ['4:3', '16:9'],
    ImageUrl: 'https://static.pexels.com/photos/248797/pexels-photo-248797.jpeg',
    ImageType: 'image/jpeg'
  };

constructor(private validationService: ValidationService,
            private imageService: ImageService,
            private http: HttpClient) {
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
    this.refreshPhotoGallery();
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
    const formData = new FormData();
    formData.append(this.selectedFile.name, this.selectedFile);
    this.imageService.uploadPatientPhoto(formData).subscribe(res => {
      this.refreshPhotoGallery();
    });
  }

  refreshPhotoGallery() {
    this.galleryImages = [];
    this.fullListOfPatientPhotos = [];
    this.imageService.getListOfPatientPhotos().subscribe(res => {
      const photoList: string[] = res;
      photoList.forEach(photo => {
        this.fullListOfPatientPhotos.push('assets/Upload/' + photo);
        this.galleryImages.push(
          {
            small: 'assets/Upload/' + photo,
            medium: 'assets/Upload/' + photo,
            big: 'assets/Upload/' + photo
          }
        );
      });
      if (this.fullListOfPatientPhotos.length > 0) {
        this.currentlySelectedPhoto = this.fullListOfPatientPhotos[0];
      }
    });
  }

  updateSelectedPhoto(photo: string) {
    this.currentlySelectedPhoto = photo;
  }

  public close() {
    // Fired when the editor is closed.
  }

  public getEditedFile(file: File) {
    // Fired when the file has been processed.
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
