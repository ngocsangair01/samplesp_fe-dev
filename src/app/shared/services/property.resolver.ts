import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable()
export class PropertyResolver implements Resolve<any> {
  constructor() { }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {
    const resource = route.data['resource'];
    // URL: rstate.url
    // TODO: get MenuId by URL
    return null;
  }
}
