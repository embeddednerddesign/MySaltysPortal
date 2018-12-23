import { NgModule } from '@angular/core';
import { Route, Routes, RouterModule } from '@angular/router';

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
import { CatalogueComponent } from './management/catalogue/catalogue.component';
import { AuthComponent } from './auth-component/auth-component.component';

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
import { AppointmentsComponent } from './schedule/appointments/appointments.component';
import { RoomsComponent } from './schedule/rooms/rooms.component';

import { VisitsComponent } from './schedule/appointments/actionpanel/visits/visits.component';
import { CreateVisitComponent } from './schedule/appointments/actionpanel/create-visit/create-visit.component';
import { EditServiceComponent } from './management/catalogue/actionpanel/edit-service/edit-service.component';
import { EditSpecialComponent } from './management/catalogue/actionpanel/edit-special/edit-special.component';
import { EditPackageComponent } from './management/catalogue/actionpanel/edit-package/edit-package.component';
import { EditProductComponent } from './management/catalogue/actionpanel/edit-product/edit-product.component';
import { EditResourceComponent } from './management/organization/actionpanel/edit-resource/edit-resource.component';
import { EditUserComponent } from './management/organization/actionpanel/edit-user/edit-user.component';
import { EmilyComponent } from './emily/emily.component';
import { AuthGuard } from './app.auth.guard';
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
import { EmployeeScheduleComponent } from './schedule/employee-schedule/employee-schedule.component';
import { CreateShiftComponent } from './schedule/employee-schedule/actionpanel/create-shift/create-shift.component';
import { OrgClinicsComponent } from './management/organization/org-clinics/org-clinics.component';
import { EditClinicComponent } from './management/organization/actionpanel/edit-clinic/edit-clinic.component';

const addEditPatient: Route = {
  path: 'edit-patient/:patid',
  component: EditPatientComponent,
  canActivate: [AuthGuard],
  outlet: 'action-panel'
};

const patientPanel: Route = {
  path: 'patient/:patId',
  component: PatientComponent,
  canActivate: [AuthGuard],
  children: [
    { path: '', redirectTo: 'patienttabs', pathMatch: 'full' },
    {
      path: 'patienttabs',
      component: PatientTabsComponent,
      canActivate: [AuthGuard],
      children: [
        addEditPatient,
        { path: '', redirectTo: 'patientprofiletab', pathMatch: 'full' },
        {
          path: 'patientprofiletab',
          component: PatientProfileTabComponent,
          canActivate: [AuthGuard],
          children: [addEditPatient]
        },
        { path: 'patientcharttab', component: PatientChartTabComponent },
        {
          path: 'patientnudgestab',
          component: PatientNudgesTabComponent,
          canActivate: [AuthGuard],
          children: [addEditPatient]
        },
        {
          path: 'patientaccounttab',
          component: PatientAccountTabComponent,
          canActivate: [AuthGuard],
          children: [addEditPatient]
        },
        {
          path: 'patientphotostab',
          component: PatientPhotosTabComponent,
          canActivate: [AuthGuard],
          children: [addEditPatient],
        },
        {
          path: 'patientcommunicationtab',
          component: PatientCommunicationTabComponent,
          canActivate: [AuthGuard],
          children: [addEditPatient]
        }
      ]
    }
  ],
  outlet: 'action-panel'
};

const appRoutes: Routes = [
  { path: 'login', component: AuthComponent },
  { path: '',  redirectTo: 'schedule', pathMatch: 'full' },
  {
    path: '',
    component: EmilyComponent,
    children: [
      {
        path: 'schedule',
        component: AppointmentsComponent,
        canActivate: [AuthGuard],
        children: [
          addEditPatient,
          patientPanel,
          {
            path: 'create-visit',
            component: CreateVisitComponent,
            canActivate: [AuthGuard],
            outlet: 'action-panel'
          },
          {
            path: 'visit-details/:id',
            component: VisitsComponent,
            canActivate: [AuthGuard],
            outlet: 'action-panel'
          },
          {
            path: 'preferred-appointments',
            component: PreferredAppointmentsComponent,
            canActivate: [AuthGuard],
            outlet: 'action-panel'
          },
        ]
      },
      {
        path: 'schedule/tasks',
        component: TasksComponent,
        canActivate: [AuthGuard],
        children: [
          addEditPatient,
          patientPanel
        ]
      },
      {
        path: 'schedule/rooms',
        component: RoomsComponent,
        canActivate: [AuthGuard],
        children: [
          addEditPatient,
          patientPanel
        ]
      },
      {
        path: 'schedule/employee-schedule',
        component: EmployeeScheduleComponent,
        canActivate: [AuthGuard],
        children: [
        addEditPatient,
        patientPanel,
        {
          path: 'create-shift',
          component: CreateShiftComponent,
          canActivate: [AuthGuard],
          outlet: 'action-panel'},
        ]
      },
      {
        path: 'nudges',
        component: NudgesComponent,
        children: [
          addEditPatient,
          patientPanel
        ]
      },
      {
        path: 'management',
        component: ManagementComponent,
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'catalogue', pathMatch: 'full' },
          {
            path: 'catalogue',
            component: CatalogueComponent,
            canActivate: [AuthGuard],
            children: [
              { path: '', redirectTo: 'services', pathMatch: 'full' },
              {
                path: 'services',
                component: CatalogueServicesComponent,
                canActivate: [AuthGuard],
                children: [
                  addEditPatient,
                  patientPanel,
                  {
                    path: 'edit-service/:catname/:servid',
                    component: EditServiceComponent,
                    canActivate: [AuthGuard],
                    outlet: 'action-panel'
                  }
                ]
              },
              {
                path: 'products',
                component: CatalogueProductsComponent,
                canActivate: [AuthGuard],
                children: [
                  addEditPatient,
                  patientPanel,
                  {
                    path: 'edit-product/:catname/:prodid',
                    component: EditProductComponent,
                    canActivate: [AuthGuard],
                    outlet: 'action-panel'
                  }
                ]
              },
              {
                path: 'packages',
                component: CataloguePackagesComponent,
                canActivate: [AuthGuard],
                children: [
                  addEditPatient,
                  patientPanel,
                  {
                    path: 'edit-package/:packid',
                    component: EditPackageComponent,
                    canActivate: [AuthGuard],
                    outlet: 'action-panel'
                  }
                ]
              },
              {
                path: 'specials',
                component: CatalogueSpecialsComponent,
                canActivate: [AuthGuard],
                children: [
                  addEditPatient,
                  patientPanel,
                  {
                    path: 'edit-special/:specid',
                    component: EditSpecialComponent,
                    canActivate: [AuthGuard],
                    outlet: 'action-panel'
                  }
                ]
              }
            ]
          },
          {
            path: 'address-book',
            component: AddressBookComponent,
            canActivate: [AuthGuard],
            children: [
              { path: '', redirectTo: 'doctors', pathMatch: 'full' },
              {
                path: 'doctors',
                component: AddressBookDoctorsComponent,
                canActivate: [AuthGuard],
                children: [
                  addEditPatient,
                  patientPanel,
                  {
                    path: 'edit-doctor/:doctid',
                    component: EditDoctorComponent,
                    canActivate: [AuthGuard],
                    outlet: 'action-panel'
                  }
                ]
              },
              {
                path: 'pharmacies',
                component: AddressBookPharmaciesComponent,
                canActivate: [AuthGuard],
                children: [
                  addEditPatient,
                  patientPanel,
                  {
                    path: 'edit-pharmacy/:pharmid',
                    component: EditPharmacyComponent,
                    canActivate: [AuthGuard],
                    outlet: 'action-panel'
                  }
                ]
              },
              {
                path: 'labs',
                component: AddressBookLabsComponent,
                canActivate: [AuthGuard],
                children: [
                  addEditPatient,
                  patientPanel,
                  {
                    path: 'edit-lab/:labid',
                    component: EditLabComponent,
                    canActivate: [AuthGuard],
                    outlet: 'action-panel'
                  }
                ]
              }
            ]
          },
          {
            path: 'communications',
            component: CommunicationsComponent,
            canActivate: [AuthGuard],
            children: [
              addEditPatient,
              patientPanel
            ]
          },
          {
            path: 'billing',
            component: BillingComponent,
            canActivate: [AuthGuard],
            children: [
              addEditPatient,
              patientPanel
            ]
          },
          {
            path: 'organization',
            component: OrganizationComponent,
            children: [
              { path: '', redirectTo: 'company', pathMatch: 'full' },
              {
                path: 'company',
                component: EditCompanyComponent,
                canActivate: [AuthGuard],
                children: [
                  addEditPatient,
                  patientPanel
                ]
              },
              {
                path: 'clinics',
                component: OrgClinicsComponent,
                canActivate: [AuthGuard],
                children: [
                  addEditPatient,
                  patientPanel,
                  {
                    path: 'edit-clinic/:clinicid',
                    component: EditClinicComponent,
                    canActivate: [AuthGuard],
                    outlet: 'action-panel'
                  }
                ]
              },
              {
                path: 'users',
                component: OrgUsersComponent,
                canActivate: [AuthGuard],
                children: [
                  addEditPatient,
                  patientPanel,
                  {
                    path: 'edit-user/:userid',
                    component: EditUserComponent,
                    canActivate: [AuthGuard],
                    outlet: 'action-panel'
                  }
                ]
              },
              {
                path: 'resources',
                component: OrgResourcesComponent,
                canActivate: [AuthGuard],
                children: [
                  addEditPatient,
                  patientPanel,
                  {
                    path: 'edit-resource/:rsrcid',
                    component: EditResourceComponent,
                    canActivate: [AuthGuard],
                    outlet: 'action-panel'
                  }
                ]
              }
            ]
          }
        ]
      },
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class Routing {}
