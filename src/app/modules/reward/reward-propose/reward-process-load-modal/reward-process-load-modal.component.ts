import { ChangeDetectionStrategy, Component, NgZone, OnInit } from "@angular/core";
import { BaseComponent } from "@app/shared/components/base-component/base-component.component";
import { CommonUtils } from "@app/shared/services";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AppComponent } from '@app/app.component';
import _ from 'lodash';
@Component({
    selector: 'reward-process-load-modal',
    templateUrl: './reward-process-load-modal.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class RewardProcessLoadModalComponent extends BaseComponent implements OnInit {
    info: any = {
        1: { percent: 0 },
        2: { percent: 0 },
        3: { percent: 0 },
        4: { percent: 0 }
    };
    constructor(
        public activeModal: NgbActiveModal,
        private ngZone: NgZone,
        private app: AppComponent,
    ) {
        super(null, CommonUtils.getPermissionCode("resource.reward-propose"));
    }

    ngOnInit() {
    }

    updateView(info) {
        for (const key in info) {
            this.info[key] = info[key];
        }
        this.info = _.cloneDeep(this.info);
        this.checkForClose();
    }
    wait(ms: number)  {
      return new Promise((resolve)=> {
        setTimeout(resolve, ms);
      });
    }
    checkForClose() {
        if (this.info[1].status == 'done' && this.info[2].status == 'done' && this.info[3].status == 'done' && this.info[4].status == 'done') {
            this.activeModal.close();
        }
    }
}
