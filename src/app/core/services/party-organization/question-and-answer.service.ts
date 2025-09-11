
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { BasicService } from '../basic.service';
import { Observable } from 'rxjs';
import { CommonUtils } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class QuestionAndAnswerService extends BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
    super('political', 'questionAndAnswer', httpClient, helperService);
  }

    /**
   * tra loi cau hoi
   */
  public answerQuestion(item: any): Observable<any> {
    const url = `${this.serviceUrl}/answer-question`;
    return this.postRequest(url, CommonUtils.convertData(item));  
  }

}
