import { Component, inject } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { CardModule } from 'primeng/card';
import { Button } from "primeng/button";

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  imports: [CardModule, Button],
})
export class UnauthorizedComponent {
  private authService = inject(MsalService);

  /**
   * Signs out the current user
   * @returns void
   */
  protected signOut() {
    this.authService.logout().subscribe();
  }
}
