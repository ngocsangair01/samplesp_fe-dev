import { Component, Input,Output , OnInit ,EventEmitter  } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ActivatedRoute, Router} from '@angular/router';
import { ACTION_FORM, RESOURCE} from '@app/core';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';
import { SortEvent } from 'primeng/api';
import { Subject } from 'rxjs';
@Component({
  selector: 'reward-decide-table',
  templateUrl: './reward-decide-table.component.html',
  styleUrls: ['./reward-decide-table.component.css']
})
export class RewardDecideTableComponent extends BaseComponent implements OnInit {
  @Input() dataFormRewardDecide: Subject<any> = new Subject<any>();
  @Input() isDisable: boolean = false;
  @Input() resetForm: Subject<any> = new Subject<any>();
  @Output() eventAddDecide = new EventEmitter();
  @Output() renderDataDecide = new EventEmitter();
  isView: boolean = false;
  isEdit: boolean = false;
  isViewSign: boolean = false;
  isEditSign: boolean = false;
  isViewSelection: boolean = false;
  isEditSelection: boolean = false;
  numIndex = 1;
  formRewardDecide : Array<any>;
  firstRowIndex = 0;
  pageSize = 10;
  constructor(
    private router: Router,
    public actr: ActivatedRoute,
    private rewardProposeService: RewardProposeService
  ) {
    super(actr, RESOURCE.MASS_MEMBER, ACTION_FORM.INSERT);
    this.setMainService(rewardProposeService);
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 3) {
      this.isView = subPaths[3] === 'view';
      this.isEdit = subPaths[3] === 'edit';
      this.isViewSign = subPaths[3] === 'view-sign';
      this.isEditSign = subPaths[3] === 'edit-sign';
      this.isViewSelection = subPaths[3] === 'view-selection';
      this.isEditSelection = subPaths[3] === 'edit-selection';
    }
    this.dataFormRewardDecide.subscribe((res)=> {
      // this.formRewardDecide = this.formRewardDecide && this.formRewardDecide.length > 0 ?  this.formRewardDecide.concat(res) : res
      this.formRewardDecide = res
    })
    this.resetForm.subscribe(()=> {
      this.formRewardDecide = []
    })
  }
  addRewardDecide() {
    this.eventAddDecide.emit();
  }
  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      const value1 = data1[event.field];
      const value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null) {
        result = -1;

      } else if (value1 != null && value2 == null) {
        result = 1;
      } else if (value1 == null && value2 == null) {
        result = 0;
      } else {
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
      }
      return (event.order * result);
    });
  }
  private sortDataTable() {
    const _event = {
      data: this.formRewardDecide,
      field: 'sortOrder',
      mode: 'single',
      order: 1
    };
    this.customSort(_event);
  }
  remove(index: number, item: Object) {
    this.numIndex--;
    this.formRewardDecide.splice(index , 1);
    this.sortDataTable();
    this.renderDataDecide.emit(this.formRewardDecide)
  }
}
