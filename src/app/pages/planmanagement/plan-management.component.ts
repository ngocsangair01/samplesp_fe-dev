import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

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

  pageSizeOptions = [10, 20, 50, 100];
  pageSize = 10;
  currentPage = 1;

  activeMenu: number | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      planName: [''],
      planType: [''],
      status: [''],
      startDate: [''],
      endDate: [''],
      assignerUnit: [''],
      updatedBy: [''],
      pageSize: [10],
      page: [1]
    });

    this.search();
  }

  search(): void {
    this.loading = true;
    const url = `${environment.apiBaseUrl}/v1/plan/search`;

    const params = {
      ...this.searchForm.value,
      page: this.currentPage,
      pageSize: this.searchForm.value.pageSize
    };

    this.http.post<DataTableResults<PlanBean>>(url, params)
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

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.search();
  }

  nextPage(): void {
    this.currentPage++;
    this.search();
  }

  prevPage(): void {
    this.currentPage--;
    this.search();
  }

  createPlan(): void {
    this.router.navigate(['/plan/create']);
  }

  toggleDropdown(index: number, event: MouseEvent): void {
    event.stopPropagation(); // tránh click đóng ngay lập tức
    this.activeMenu = this.activeMenu === index ? null : index;
  }

  @HostListener('document:click')
  closeDropdown(): void {
    this.activeMenu = null;
  }

  viewPlan(id: number) {
    console.log('Xem', id);
  }
  editPlan(id: number) {
    console.log('Sửa', id);
  }
  createSign(planId: number) {
    this.router.navigate(['/sign'], { queryParams: { planId: planId } });
  }
  deletePlan(id: number) {
    console.log('Xoá', id);
  }
}
