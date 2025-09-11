import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-plan',
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.scss']
})
export class CreatePlan implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  createSign(planId: number): void {
    this.router.navigate(['/sign'], { queryParams: { planId: planId } });
  }
}
