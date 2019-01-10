import 'jquery';
import 'moment';
import 'fullcalendar';
import 'fullcalendar-scheduler';
import 'hammerjs';
import 'hammer-timejs';

import { ScheduleModule } from '../../primeng/schedule';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes, Route } from '@angular/router';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { LoadingModule } from 'ngx-loading';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { ContextMenuModule } from 'ngx-contextmenu';
import { OverlayPanelModule } from '../../primeng/overlaypanel';
import { ColorPickerModule } from '../../primeng/colorpicker';
import { FileUploadModule } from '../../primeng/fileupload';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MatMomentDateModule } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NgModel } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';

import { AppComponent } from './app.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { NudgesComponent } from './nudges/nudges.component';
import { PatientComponent } from './patients/patient.component';
import { PatientsComponent } from './patients/patients.component';
import { PatientTabsComponent } from './patients/patient-tabs/patient-tabs.component';
import { PatientAccountTabComponent } from './patients/patient-tabs/patient-account-tab/patient-account-tab.component';
import { PatientChartTabComponent } from './patients/patient-tabs/patient-chart-tab/patient-chart-tab.component';
import { PatientCommunicationTabComponent } from './patients/patient-tabs/patient-communication-tab/patient-communication-tab.component';
import { PatientNudgesTabComponent } from './patients/patient-tabs/patient-nudges-tab/patient-nudges-tab.component';
import { PatientPhotosTabComponent } from './patients/patient-tabs/patient-photos-tab/patient-photos-tab.component';
import { PatientProfileTabComponent } from './patients/patient-tabs/patient-profile-tab/patient-profile-tab.component';
import { EditPatientComponent } from './patients/actionpanel/edit-patient/edit-patient.component';
import { ManagementComponent } from './management/management.component';
import { TopnavComponent } from './topnav/topnav.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { CalnavComponent } from './calendarnav/calnav.component';
import { CalnavnoheaderComponent } from './calendarnav/calnavnoheader.component';
import { ViewerComponent } from './viewer/viewer.component';
import { CatalogueComponent } from './management/catalogue/catalogue.component';
import { QuickLinksComponent } from './sidenav/quick-links/quick-links.component';
import { AuthComponent } from './auth-component/auth-component.component';
import { ClickOutsideModule } from 'ng-click-outside';

import { CurrentDataService } from './services/currentData.service';
import { ClinicsService } from './services/clinics.service';
import { CompanyService } from './services/company.service';
import { DoctorsService } from './services/doctors.service';
import { PackagesService } from './services/packages.service';
import { PharmaciesService } from './services/pharmacies.service';
import { LabsService } from './services/labs.service';
import { ResourcesService } from './services/resources.service';
import { EventsService } from './services/events.service';
import { ProductsService } from './services/products.service';
import { ServicesService } from './services/services.service';
import { ActionPanelService } from './services/actionpanel.service';
import { CatalogueUpdatesService } from './services/catalogueupdates.service';
import { NavStateService } from './services/navstate.service';
import { StaffsService } from './services/staffs.service';
import { PatientService } from './services/patient.service';
import { VisitService } from './services/visit.service';
import { AuthService } from './services/auth.service';
import { GeographyService } from './services/geography.service';
import { ValidationService } from './services/validation.service';
import { HoursOfOperationService } from './services/hoursofoperation.service';
import { UsersService } from './services/users.service';
import { MasterOverlayService } from './services/actionpanel.service';
import { AppointmentService } from './services/appointments.service';
import { CategoryService } from './services/category.service';
import { TaxService } from './services/tax.service';
import { RoomService } from './services/room.service';
import { StaffScheduleService } from './services/staffschedule.service';
import { ImageService } from './services/image.service';

import { CatalogueServicesComponent } from './management/catalogue/catalogue-services/catalogue-services.component';
import { CatalogueProductsComponent } from './management/catalogue/catalogue-products/catalogue-products.component';
import { CataloguePackagesComponent } from './management/catalogue/catalogue-packages/catalogue-packages.component';
import { CatalogueSpecialsComponent } from './management/catalogue/catalogue-specials/catalogue-specials.component';
import { AddressBookComponent } from './management/address-book/address-book.component';
import { CommunicationsComponent } from './management/communications/communications.component';
import { BillingComponent } from './management/billing/billing.component';
import { OrganizationComponent } from './management/organization/organization.component';
import { OrgResourcesComponent } from './management/organization/org-resources/org-resources.component';
import { OrgUsersComponent } from './management/organization/org-users/org-users.component';
import { TasksComponent } from './schedule/tasks/tasks.component';
import { ResourcesComponent } from './schedule/resources/resources.component';
import { AppointmentsComponent } from './schedule/appointments/appointments.component';
import { RoomsComponent } from './schedule/rooms/rooms.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// tslint:disable-next-line:max-line-length
import { ServiceCategoryDetailsComponent } from './management/catalogue/catalogue-services/service-category-details/service-category-details.component';
import { ProductDetailsComponent } from './management/catalogue/catalogue-products/product-details/product-details.component';
import { ActionPanelComponent } from './schedule/appointments/actionpanel/actionpanel.component';
import { VisitsComponent } from './schedule/appointments/actionpanel/visits/visits.component';
import { AppointmentComponent } from './schedule/appointments/appointment/appointment.component';
import { StaffScheduleComponent } from './schedule/employee-schedule/staffschedule/staffschedule.component';
import { StaffUnavailableComponent } from './schedule/appointments/staff-unavailable/staff-unavailable.component';
import { DragMoveDirective } from './drag-move.directive';
import { CreateVisitComponent } from './schedule/appointments/actionpanel/create-visit/create-visit.component';
import { EditServiceComponent } from './management/catalogue/actionpanel/edit-service/edit-service.component';
import { EditSpecialComponent } from './management/catalogue/actionpanel/edit-special/edit-special.component';
import { EditPackageComponent } from './management/catalogue/actionpanel/edit-package/edit-package.component';
import { EditProductComponent } from './management/catalogue/actionpanel/edit-product/edit-product.component';
import { EditResourceComponent } from './management/organization/actionpanel/edit-resource/edit-resource.component';
import { EditUserComponent } from './management/organization/actionpanel/edit-user/edit-user.component';
import { IntlModule } from '@progress/kendo-angular-intl';
import { EmployeePortalComponent } from './employeeportal/employeeportal.component';
import { AuthGuard } from './app.auth.guard';
import { CancelVisitDialogComponent } from './schedule/appointments/actionpanel/cancel-visit-dialog/cancel-visit-dialog.component';
import { ConfirmDeleteDialogComponent } from './management/dialogs/confirm-delete/confirm-delete.component';
import { ConfirmApptCancelDialogComponent } from './management/dialogs/confirm-appt-cancel/confirm-appt-cancel.component';
import { ConfirmAppointmentDialogComponent } from './management/dialogs/confirm-appointment/confirm-appointment.component';
import { HoursOfOperationDialogComponent } from './management/dialogs/hours-of-operation/hours-of-operation.component';
import { ManageCategoriesDialogComponent } from './management/dialogs/manage-categories/manage-categories.component';
import { CategoryItemComponent } from './management/dialogs/manage-categories/category-item/component';
import { AddressBookDoctorsComponent } from './management/address-book/address-book-doctors/address-book-doctors.component';
import { EditDoctorComponent } from './management/address-book/actionpanel/edit-doctor/edit-doctor.component';
import { AddressBookPharmaciesComponent } from './management/address-book/address-book-pharmacies/address-book-pharmacies.component';
import { EditPharmacyComponent } from './management/address-book/actionpanel/edit-pharmacy/edit-pharmacy.component';
import { AddressBookLabsComponent } from './management/address-book/address-book-labs/address-book-labs.component';
import { EditLabComponent } from './management/address-book/actionpanel/edit-lab/edit-lab.component';
import { EditCompanyComponent } from './management/organization/org-company/org-company.component';
import { CancelVisitComponent } from './schedule/appointments/actionpanel/cancel-visit/cancel-visit.component';
// tslint:disable-next-line:max-line-length
import { PreferredAppointmentsComponent } from './schedule/appointments/actionpanel/preferred-appointments/preferred-appointments.component';

import { SwitchModule } from '@progress/kendo-angular-inputs';
import { SpecialsService } from './services/specials.service';
import { CurrentDateComponent } from './current-date/current-date.component';
import { TitleCasePipe } from '../../node_modules/@angular/common';
import { FormatterService } from './services/formatter.service';
import { EmployeeScheduleComponent } from './schedule/employee-schedule/employee-schedule.component';
import { CreateShiftComponent } from './schedule/employee-schedule/actionpanel/create-shift/create-shift.component';

import { Routing } from './app.routing';
import { VisitStatusDialogComponent } from './visit-status-dialog/visit-status-dialog.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AddressService } from './services/address.service';
import { EditClinicComponent } from './management/organization/actionpanel/edit-clinic/edit-clinic.component';
import { OrgClinicsComponent } from './management/organization/org-clinics/org-clinics.component';
import { NgxGalleryModule } from 'ngx-gallery';
import { NgxImageEditorModule } from 'ngx-image-editor';

import { SimplePdfViewerModule } from 'simple-pdf-viewer';
import { ViewPdfDialogComponent } from './management/dialogs/view-pdf/view-pdf.component';
import { OrgServicesComponent } from './management/organization/org-services/org-services.component';
import { OrgServiceCategoryDetailsComponent } from './management/organization/org-services/org-service-category-details/org-service-category-details.component';

@NgModule({
  entryComponents: [
    AppointmentComponent,
    StaffScheduleComponent,
    StaffUnavailableComponent,
    ConfirmDeleteDialogComponent,
    ConfirmApptCancelDialogComponent,
    ConfirmAppointmentDialogComponent,
    HoursOfOperationDialogComponent,
    CancelVisitDialogComponent,
    ManageCategoriesDialogComponent,
    VisitStatusDialogComponent,
    ViewPdfDialogComponent
  ],
  declarations: [
    AppComponent,
    ScheduleComponent,
    NudgesComponent,
    PatientComponent,
    PatientsComponent,
    PatientTabsComponent,
    PatientAccountTabComponent,
    PatientChartTabComponent,
    PatientCommunicationTabComponent,
    PatientNudgesTabComponent,
    PatientPhotosTabComponent,
    PatientProfileTabComponent,
    AddressBookDoctorsComponent,
    AddressBookPharmaciesComponent,
    AddressBookLabsComponent,
    ManagementComponent,
    TopnavComponent,
    SidenavComponent,
    CalnavComponent,
    CalnavnoheaderComponent,
    ViewerComponent,
    CatalogueComponent,
    CatalogueServicesComponent,
    AddressBookComponent,
    CommunicationsComponent,
    BillingComponent,
    OrganizationComponent,
    TasksComponent,
    ResourcesComponent,
    AppointmentsComponent,
    RoomsComponent,
    QuickLinksComponent,
    CatalogueProductsComponent,
    CataloguePackagesComponent,
    CatalogueSpecialsComponent,
    OrgResourcesComponent,
    OrgUsersComponent,
    OrgServicesComponent,
    OrgClinicsComponent,
    EditUserComponent,
    EditResourceComponent,
    EditProductComponent,
    ServiceCategoryDetailsComponent,
    OrgServiceCategoryDetailsComponent,
    EditServiceComponent,
    EditSpecialComponent,
    EditPackageComponent,
    EditProductComponent,
    EditDoctorComponent,
    EditPharmacyComponent,
    EditLabComponent,
    EditCompanyComponent,
    EditClinicComponent,
    EditPatientComponent,
    ProductDetailsComponent,
    ActionPanelComponent,
    VisitsComponent,
    AppointmentComponent,
    DragMoveDirective,
    CreateVisitComponent,
    AuthComponent,
    EmployeePortalComponent,
    CancelVisitDialogComponent,
    CancelVisitComponent,
    ConfirmDeleteDialogComponent,
    ConfirmApptCancelDialogComponent,
    ConfirmAppointmentDialogComponent,
    PreferredAppointmentsComponent,
    HoursOfOperationDialogComponent,
    CurrentDateComponent,
    ManageCategoriesDialogComponent,
    ViewPdfDialogComponent,
    PatientComponent,
    EmployeeScheduleComponent,
    CreateShiftComponent,
    CategoryItemComponent,
    StaffScheduleComponent,
    StaffUnavailableComponent,
    VisitStatusDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    Routing,
    AngularFontAwesomeModule,
    BrowserAnimationsModule,
    GridModule,
    ExcelModule,
    LoadingModule,
    InlineSVGModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTabsModule,
    ScheduleModule,
    ColorPickerModule,
    MatSelectModule,
    ContextMenuModule.forRoot({
      useBootstrap4: true
    }),
    OverlayPanelModule,
    MatButtonModule,
    MatRadioModule,
    MatDatepickerModule,
    MatMomentDateModule,
    DateInputsModule,
    IntlModule,
    DropDownsModule,
    MatExpansionModule,
    FormsModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatProgressBarModule,
    SwitchModule,
    MatSidenavModule,
    ClickOutsideModule,
    FileUploadModule,
    MatMenuModule,
    NgxGalleryModule,
    NgxImageEditorModule,
    SimplePdfViewerModule
  ],
  providers: [
    CurrentDataService,
    ProductsService,
    EventsService,
    ServicesService,
    ActionPanelService,
    CatalogueUpdatesService,
    NavStateService,
    StaffsService,
    PatientService,
    NgModel,
    VisitService,
    AuthService,
    AuthGuard,
    ClinicsService,
    LabsService,
    CompanyService,
    DoctorsService,
    PackagesService,
    PharmaciesService,
    ResourcesService,
    SpecialsService,
    GeographyService,
    ValidationService,
    FormatterService,
    HoursOfOperationService,
    UsersService,
    MasterOverlayService,
    AppointmentService,
    CategoryService,
    TaxService,
    RoomService,
    StaffScheduleService,
    AddressService,
    ImageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
