import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface PlanBean {
  planId: number;
  planName: string;
  planType: string;
  assignerUnit: string;
  startDate: string;
  endDate: string;
  status: string;
  updatedDate: string;
  updatedBy: string;
}

interface DataTableResults<T> {
  draw: string;
  first: string;
  recordsFiltered: string;
  recordsTotal: string;
  data: T[];
  headerConfig: any[];
}

@Component({
  selector: 'app-plan-management',
  templateUrl: './plan-management.component.html',
  styleUrls: ['./plan-management.component.scss']
})
export class PlanManagementComponent implements OnInit {

  searchForm!: FormGroup;
  plans: PlanBean[] = [];
  totalRecords = 0;
  loading = false;

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      planName: [''],
      planType: [''],
      status: [''],
      startDate: [''],
      endDate: [''],
      assignerUnit: [''],
      updatedBy: ['']
    });

    this.search();
  }

  search(): void {
    this.loading = true;
    const url = `${environment.apiBaseUrl}/v1/plan/search`;
    this.http.post<DataTableResults<PlanBean>>(url, this.searchForm.value)
      .subscribe({
        next: (res) => {
          this.plans = res.data || [];
          this.totalRecords = Number(res.recordsTotal || this.plans.length);
          this.loading = false;
        },
        error: (err) => {
          console.error('Search failed', err);
          this.loading = false;
        }
      });
  }

  reset(): void {
    this.searchForm.reset();
    this.search();
  }
}
