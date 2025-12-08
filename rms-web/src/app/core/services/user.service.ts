// import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // private httpClient = inject(HttpClient);

  // GetAll(): Observable<IUser[]> {
  //   const url = `${environment.API_URL}/user`;
  //   return this.httpClient.get<IUser[]>(url);
  // }

  GetPermissions(): Observable<any> {
    // const url = `${environment.API_URL}/user/permissions`;
    // return this.httpClient.get<IUserPermission>(url);
    return new Observable<any>((subscriber) => {
      const roles = [{ id: 1, name: 'Admin' }];
      subscriber.next(roles);
      subscriber.complete();
    });
  }

  GetRoles(): Observable<any> {
    // const url = `${environment.API_URL}/user/roles`;
    // return this.httpClient.get<IUserRole[]>(url);
    return new Observable<any>((subscriber) => {
      const roles = [{ id: 1, name: 'Admin' }];
      subscriber.next(roles);
      subscriber.complete();
    });
  }
}
