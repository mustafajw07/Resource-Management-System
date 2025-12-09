import { Injectable, signal } from '@angular/core';
import { User } from '@core/interfaces/User';

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  roles$ = signal<string[] | null>(null);
  user$ = signal<User | null>(null);

  setUserRolesAndPermissions(user: User, roles: string[] | null) {
    this.user$.set(user);
    this.roles$.set(roles);
  }
}
