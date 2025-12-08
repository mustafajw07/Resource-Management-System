import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  roles$ = signal<any[] | null>(null);
  permissions$ = signal<any>({});
  user$ = signal<any | null>(null);
  
  setUserRolesAndPermissions(user: any, roles: any[], permissions: any) {
    this.user$.set(user);
    this.roles$.set(roles);
    this.permissions$.set(permissions);
  }

}
