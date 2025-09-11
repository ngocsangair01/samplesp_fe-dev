import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APP_CONSTANTS } from '@app/core';

@Component({
  selector: 'redirect-security',
  templateUrl: './redirect-security.component.html'
})
export class RedirectSecurityComponent implements OnInit {

  constructor(
    private router: Router
  ) {
    this.redirectToVHR();
   }

  ngOnInit() {
  }

  public redirectToVHR() {
    window.open(APP_CONSTANTS.VHR.BASE_URL, '_blank');
    this.router.navigate(['/home-page']);
  }
}
