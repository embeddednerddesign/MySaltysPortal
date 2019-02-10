import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagementComponent } from './management/management.component';
import { AuthComponent } from './auth-component/auth-component.component';
import { OrganizationComponent } from './management/organization/organization.component';
import { OrgUsersComponent } from './management/organization/org-users/org-users.component';
import { HomeComponent } from './schedule/home/home.component';
import { ResourcesComponent } from './schedule/resources/resources.component';
import { AppointmentsComponent } from './schedule/appointments/appointments.component';
import { EditUserComponent } from './management/organization/actionpanel/edit-user/edit-user.component';
import { EmployeePortalComponent } from './employeeportal/employeeportal.component';
import { AuthGuard } from './app.auth.guard';
import { OrgSchedulesComponent } from './management/organization/org-schedules/org-schedules.component';
import { OrgHomeContentComponent } from './management/organization/org-home-content/org-home-content.component';
import { OrgResourcesComponent } from './management/organization/org-resources/org-resources.component';

const appRoutes: Routes = [
  { path: 'login', component: AuthComponent },
  { path: '',  redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: EmployeePortalComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'resources',
        component: ResourcesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'schedule',
        component: AppointmentsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'management',
        component: ManagementComponent,
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'organization', pathMatch: 'full' },
          {
            path: 'organization',
            component: OrganizationComponent,
            children: [
              { path: '', redirectTo: 'users', pathMatch: 'full' },
              // {
              //   path: 'company',
              //   component: EditCompanyComponent,
              //   canActivate: [AuthGuard],
              //   children: []
              // },
              {
                path: 'users',
                component: OrgUsersComponent,
                canActivate: [AuthGuard],
                children: [
                  {
                    path: 'edit-user/:userid',
                    component: EditUserComponent,
                    canActivate: [AuthGuard],
                    outlet: 'action-panel'
                  }
                ]
              },
              {
                path: 'scheduleUpload',
                component: OrgSchedulesComponent,
                canActivate: [AuthGuard],
                children: []
              },
              {
                path: 'homeContentUpload',
                component: OrgHomeContentComponent,
                canActivate: [AuthGuard],
                children: []
              },
              {
                path: 'resourceUpload',
                component: OrgResourcesComponent,
                canActivate: [AuthGuard],
                children: []
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
