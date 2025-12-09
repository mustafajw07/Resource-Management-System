import { inject, Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly msalService = inject(MsalService);

  /**
   * Check synchronously whether the current user has a specific role.
   */
  public doesUserHaveRole(roleToCheck: string): boolean {
    const roles = this.getRolesSync();
    return roles.includes(roleToCheck);
  }

  /**
   * Returns user roles as an Observable. Always emits an array (possibly empty).
   */
  public getRoles(): Observable<string[]> {
    const roles = this.getRolesSync();
    return of(roles);
  }

  /**
   * Synchronous helper to read roles from the active account's id token claims.
   * Returns an array (empty if not present).
   */
  private getRolesSync(): string[] {
    const claims = this.msalService.instance.getActiveAccount()?.idTokenClaims;
    const userRoles = claims && (claims as any).roles ? (claims as any).roles as string[] : [];
    return Array.isArray(userRoles) ? userRoles : [];
  }
}
