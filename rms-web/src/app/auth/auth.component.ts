import { Component, inject } from '@angular/core';
import { MsalGuardConfiguration, MSAL_GUARD_CONFIG, MsalService } from '@azure/msal-angular';
import { RedirectRequest } from '@azure/msal-browser';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  imports: [ButtonModule],
})
export class AuthComponent {
  private msalGuardConfig = inject<MsalGuardConfiguration>(MSAL_GUARD_CONFIG);
  private authService = inject(MsalService);
  protected isSigningIn = false;

  /**
   * Initiates the login redirect process using MSAL
   * @return void
   */
  protected loginRedirect() {
    this.isSigningIn = true;

    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({
        ...this.msalGuardConfig.authRequest,
      } as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
  }
}
