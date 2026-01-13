import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { MsalGuard } from '@azure/msal-angular';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then((c) => c.DashboardComponent),
      },
      {
        path: 'project-requisition',
        loadComponent: () =>
          import('./pages/project-requisition/project-requisition.component')
            .then(c => c.ProjectRequisitionComponent),
        canActivate: [MsalGuard],
        children: [
          {
            path: 'add',
            loadComponent: () =>
              import('./pages/project-requisition/requisition-form/requisition-form.component')
                .then(c => c.RequisitionFormComponent),
          },
        ],

      },
      {
        path: 'interns-pool',
        loadComponent: () =>
          import('./pages/interns-pool/interns-pool.component').then((c) => c.InternsPoolComponent),
      },
      {
        path: 'project-utilization',
        loadComponent: () =>
          import('./pages/project-utilization/project-utilization.component').then(
            (c) => c.ProjectUtilizationComponent),
        canActivate: [MsalGuard],
      }
    ],
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component').then((c) => c.AuthComponent),
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./unauthorized/unauthorized.component').then((c) => c.UnauthorizedComponent),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
