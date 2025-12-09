import { Injectable, signal } from '@angular/core';
import { User } from '@core/interfaces/User';

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  roles$ = signal<string[] | null>(null);
  user$ = signal<User | null>(null);

  /**
   * Set User and roles
   * @param user 
   * @param roles 
   */
  setUserRolesAndPermissions(user: User, roles: string[] | null) {
    this.user$.set(user);
    this.roles$.set(roles);
  }
}
