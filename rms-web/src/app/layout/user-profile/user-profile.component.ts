import { Component, inject, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { toast } from 'ngx-sonner';
import { finalize } from 'rxjs';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';
import { User } from '@core/interfaces/User';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  imports: [MenuModule, ButtonModule, AvatarModule],
})
export class UserProfileComponent {
  protected user: User | null= null;
  protected isUserProfileMenuOpen = false;
  protected isSigningOut = false;
  protected initials: string = '';
  protected items: MenuItem[] | undefined;
  private msalService = inject(MsalService);
  private router = inject(Router);

  async ngOnInit() {
    const activeAccount = this.msalService.instance.getActiveAccount();

    if (!activeAccount || !activeAccount.idTokenClaims) {
      return;
    }
    const fullName = (activeAccount.idTokenClaims.name as string) ?? '';
    const nameParts = fullName.trim().split(/\s+/);

    this.user = {
      id: String(activeAccount.idTokenClaims.oid),
      email: String(activeAccount.idTokenClaims.preferred_username),
      first_name: nameParts[0] || '',
      last_name: nameParts.slice(1).join(' ') || '',
      full_name: fullName,
    };

    // compute initials for avatar label
    this.initials = ((this.user.first_name?.[0] || '') + (this.user.last_name?.[0] || '')).toUpperCase();

    // Optionally update the menu to show the user's name as a header item
    this.items = [
      {
      label: `${this.user.first_name}${this.user.last_name ? ' ' + this.user.last_name : ''}`,
      disabled: true,
      },
      {
      label: this.user.email,
      items: [
        {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.handleSignOut(),
        },
      ],
      },
    ];
  }

  /**
   * Handles user sign-out process
   * @returns void
   */
  private handleSignOut() {
    this.isSigningOut = true;

    this.msalService
      .logout()
      .pipe(finalize(() => (this.isSigningOut = false)))
      .subscribe({
        next: () => {
          this.router.navigate(['auth']);
        },
        error: () => {
          toast.error('Error signing out. Please try again.');
        },
      });
  }
}
