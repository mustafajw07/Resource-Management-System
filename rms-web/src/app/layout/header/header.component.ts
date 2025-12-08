import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { MenubarModule } from 'primeng/menubar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [UserProfileComponent, MenubarModule],
})
export class HeaderComponent implements OnInit {
  protected items: MenuItem[] = [];
  private router = inject(Router);

  ngOnInit(): void {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-home',
        command: () => this.router.navigate(['/dashboard'])
      },
      {
        label: 'Project Requisition',
        icon: 'pi pi-fw pi-file',
        command: () => this.router.navigate(['/project-requisition'])
      },
      {
        label: 'Interns Pool',
        icon: 'pi pi-fw pi-users',
        command: () => this.router.navigate(['/interns-pool'])
      },
      {
        label: 'Project Utilization',
        icon: 'pi pi-fw pi-chart-bar',
        command: () => this.router.navigate(['/project-utilization'])
      },
      {
        label: 'Project Status Tracker',
        icon: 'pi pi-fw pi-briefcase',
        command: () => this.router.navigate(['/project-status-tracker'])
      },
    ]
  }
}
