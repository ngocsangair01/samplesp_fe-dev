import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ExamQuestionSetService } from '@app/core/services/thorough-content/exam-question-set.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { HelperService } from '@app/shared/services/helper.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'test-history-modal',
  templateUrl: './test-history-modal.component.html',
  styleUrls: ['./test-history-modal.component.css']
})
export class TestHistoryModaComponent extends BaseComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal,
    private service: ExamQuestionSetService,
    public actr: ActivatedRoute,
    public app: AppComponent,
    private helperService: HelperService) { 
    super();
    this.setMainService(service);
  }

  ngOnInit() {
  }

  setInitValue(res) {
    this.resultList = res;
  }

  // quay lai
  public goBack() {
    this.activeModal.close()
  }
}
