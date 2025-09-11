import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SysPropertyService } from '@app/modules/settings/sys-property/sys-property.service';

@Injectable()
export class PropertyResolver implements Resolve<any> {
  constructor(private apiService: SysPropertyService) { }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {
    const resource = route.data['resource'];
    // URL: rstate.url
    // TODO: get MenuId by URL
    return this.apiService.findPropertyDetailsByResoureCode(resource)
      .pipe(
        catchError(err => {
          console.log('Handling error locally and rethrowing it...', err);
          return of({});
        })
      );
  }
}