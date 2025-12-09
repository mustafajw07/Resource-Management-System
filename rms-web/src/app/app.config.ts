import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration, MsalService } from '@azure/msal-angular';
import { catchError, concatMap, EMPTY, forkJoin, tap } from 'rxjs';
import { LogLevel, IPublicClientApplication, PublicClientApplication, BrowserCacheLocation, InteractionType } from '@azure/msal-browser';
import { UserService } from './core/services/user.service';
import { PermissionsService } from './core/services/permissions.service';
import { environment } from '@environments';
import { Location } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { referenceDataReducer } from './store/reference-data/reference-data.reducer';


const appInitializer = () => {
  const msalService = inject(MsalService);
  const router = inject(Router);
  const location = inject(Location);
  const userService = inject(UserService);
  const permissionsService = inject(PermissionsService);

  return msalService.handleRedirectObservable().pipe(
    concatMap((response) => {
      const accounts = msalService.instance.getAllAccounts();

      if (!response && accounts.length === 0) {
        router.navigate(['auth']);
        return EMPTY;
      }

      const activeAccount = accounts[0];
      msalService.instance.setActiveAccount(activeAccount);

      return loadUserRolesAndPermissions(userService).pipe(
        tap((roles) => {
          if (location.path() === '/auth') {
            router.navigate(['dashboard']);
          }

          permissionsService.setUserRolesAndPermissions(
            {
              id: activeAccount.idTokenClaims?.oid as string,
              email: activeAccount.idTokenClaims?.preferred_username as string,
              first_name: '',
              last_name: '',
            },
            roles
          );
        }),
        catchError((error) => {
          if ([401, 403].includes(error?.status)) {
            router.navigate(['unauthorized']);
            return EMPTY;
          }
          throw error;
        }),
      );
    }),
  );
};

// Load user roles and permissions
function loadUserRolesAndPermissions(userService: UserService) {
  return userService.getRoles();
}

export function loggerCallback(logLevel: LogLevel, message: string) {
  if (environment.dev) {
    switch (logLevel) {
      case LogLevel.Error:
        console.error(message);
        break;
      case LogLevel.Warning:
        console.warn(message);
        break;
      case LogLevel.Trace:
        console.trace(message);
        break;
      default:
        console.log(message);
    }
  } else if (environment.beta && logLevel === LogLevel.Error) {
    console.error(message);
  }
}

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.msalConfig.auth.clientId,
      authority: environment.msalConfig.auth.authority,
      redirectUri: '/dashboard',
      postLogoutRedirectUri: '/auth',
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
    },
    system: {
      allowPlatformBroker: false, // Disables WAM Broker
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false,
      },
    },
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, string[]>();

  protectedResourceMap.set(environment.apiConfig.uri, environment.apiConfig.scopes);
  protectedResourceMap.set(environment.API_URL, environment.apiConfig.scopes);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [...environment.apiConfig.scopes],
    },
    loginFailedRoute: '/auth',
  };
}



export const appConfig: ApplicationConfig = {
  providers: [
    // MSAL
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    provideAppInitializer(appInitializer),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    importProvidersFrom(StoreModule.forRoot({referenceDataReducer: referenceDataReducer})),
    providePrimeNG({
      theme: {
        preset: Aura, 
        options: {
          darkModeSelector: false
        }
      }
    })
  ],
};
