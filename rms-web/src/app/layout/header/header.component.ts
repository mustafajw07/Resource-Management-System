import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { MenubarModule } from 'primeng/menubar';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [UserProfileComponent, MenubarModule, RouterModule],
})
export class HeaderComponent implements OnInit {
  protected items: MenuItem[] = [];

  private activeRoute = '';
  private readonly router = inject(Router);

  constructor(){
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.activeRoute = event.urlAfterRedirects;
      this.setActiveClass();
    });
  }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-home',
        routerLink: '/dashboard'
      },
      {
        label: 'Project Requisition',
        icon: 'pi pi-fw pi-file',
        routerLink: '/project-requisition'
      },
      {
        label: 'Interns Pool',
        icon: 'pi pi-fw pi-users',
        routerLink: '/interns-pool'
      },
      {
        label: 'Project Utilization',
        icon: 'pi pi-fw pi-chart-bar',
        routerLink: '/project-utilization'
      }
    ];
      this.setActiveClass();
  }

  /**
   * Sets the active class on the menu items based on the current route
   * @return void
   * @private
   */
  private setActiveClass() {
    this.items = this.items.map(item => ({
      ...item,
      styleClass: item.routerLink === this.activeRoute
        ? 'active-menu'
        : ''
    }));
  }
}
