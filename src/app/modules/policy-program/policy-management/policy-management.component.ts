import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APP_CONSTANTS } from '@app/core';

@Component({
  selector: 'policy-management',
  templateUrl: './policy-management.component.html',
})
export class PolicyManagementComponent implements OnInit {

  constructor(
    private router: Router
  ) {
    this.redirect();
  }

  ngOnInit() {
  }

  redirect() {
    window.open(APP_CONSTANTS.VHR.POLICY_MANAGEMENT, '_blank');
    this.router.navigate(['/home-page']);
  }
}
