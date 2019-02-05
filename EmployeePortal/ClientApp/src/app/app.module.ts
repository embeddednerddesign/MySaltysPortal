import 'jquery';
import 'moment';
import 'fullcalendar';
import 'fullcalendar-scheduler';
import 'hammerjs';
import 'hammer-timejs';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { MatMomentDateModule } from '@angular/material-moment-adapter';
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
import { ManagementComponent } from './management/management.component';
import { TopnavComponent } from './topnav/topnav.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ViewerComponent } from './viewer/viewer.component';
import { AuthComponent } from './auth-component/auth-component.component';
import { ClickOutsideModule } from 'ng-click-outside';

import { CurrentDataService } from './services/currentData.service';
import { CompanyService } from './services/company.service';
import { HomeContentService } from './services/home-content.service';
import { CatalogueUpdatesService } from './services/catalogueupdates.service';
import { ActionPanelService } from './services/actionpanel.service';
import { AuthService } from './services/auth.service';
import { GeographyService } from './services/geography.service';
import { ValidationService } from './services/validation.service';
import { UsersService } from './services/users.service';
import { MasterOverlayService } from './services/actionpanel.service';
import { ImageService } from './services/image.service';

import { OrganizationComponent } from './management/organization/organization.component';
import { OrgUsersComponent } from './management/organization/org-users/org-users.component';
import { OrgSchedulesComponent } from './management/organization/org-schedules/org-schedules.component';
import { HomeComponent } from './schedule/home/home.component';
import { ResourcesComponent } from './schedule/resources/resources.component';
import { AppointmentsComponent } from './schedule/appointments/appointments.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ActionPanelComponent } from './schedule/appointments/actionpanel/actionpanel.component';
import { DragMoveDirective } from './drag-move.directive';
import { EditUserComponent } from './management/organization/actionpanel/edit-user/edit-user.component';
import { IntlModule } from '@progress/kendo-angular-intl';
import { EmployeePortalComponent } from './employeeportal/employeeportal.component';
import { AuthGuard } from './app.auth.guard';
import { ConfirmDeleteDialogComponent } from './management/dialogs/confirm-delete/confirm-delete.component';
import { EditCompanyComponent } from './management/organization/org-company/org-company.component';

import { SwitchModule } from '@progress/kendo-angular-inputs';
import { CurrentDateComponent } from './current-date/current-date.component';
import { FormatterService } from './services/formatter.service';
import { Routing } from './app.routing';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AddressService } from './services/address.service';
import { NgxGalleryModule } from 'ngx-gallery';
import { NgxImageEditorModule } from 'ngx-image-editor';
import { SimplePdfViewerModule } from 'simple-pdf-viewer';
import { ViewPdfDialogComponent } from './management/dialogs/view-pdf/view-pdf.component';

@NgModule({
  entryComponents: [
    ConfirmDeleteDialogComponent,
    ViewPdfDialogComponent
  ],
  declarations: [
    AppComponent,
    ManagementComponent,
    OrganizationComponent,
    OrgUsersComponent,
    OrgSchedulesComponent,
    HomeComponent,
    ResourcesComponent,
    AppointmentsComponent,
    EditUserComponent,
    AuthComponent,
    EmployeePortalComponent,
    TopnavComponent,
    SidenavComponent,
    ViewerComponent,
    EditCompanyComponent,
    ActionPanelComponent,
    DragMoveDirective,
    ConfirmDeleteDialogComponent,
    CurrentDateComponent,
    ViewPdfDialogComponent,
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
    ActionPanelService,
    CatalogueUpdatesService,
    NgModel,
    AuthService,
    AuthGuard,
    CompanyService,
    HomeContentService,
    GeographyService,
    ValidationService,
    FormatterService,
    UsersService,
    MasterOverlayService,
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
