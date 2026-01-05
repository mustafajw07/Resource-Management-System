import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

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
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'list',
          },
          {
            path: 'list',
            loadComponent: () =>
              import('./pages/project-requisition/requisition-table/requisition-table.component')
                .then(c => c.RequisitionTableComponent),
          },
          {
            path: 'add',
            loadComponent: () =>
              import('./pages/project-requisition/requisition-form/requisition-form.component')
                .then(c => c.RequisitionFormComponent),
          },
          {
            path: 'details/:requisitionId',
            loadComponent: () =>
              import('./pages/project-requisition/requisition-view/requisition-view.component')
                .then(c => c.RequisitionViewComponent),
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
