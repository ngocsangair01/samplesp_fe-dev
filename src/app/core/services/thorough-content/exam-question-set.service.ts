import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { CommonUtils, CryptoService } from '@app/shared/services';

@Injectable({
    providedIn: 'root'
})
export class ExamQuestionSetService extends BasicService {


    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'exam-question-set', httpClient, helperService);
    }

    public getListByDomain() {
        const url = `${this.serviceUrl}/get-list-by-domain`;
        return this.getRequest(url);
    }

    public findTemplateActive(item: String) : Observable<any>{
        const url = `${this.serviceUrl}/find-template-active/${item}`;
        return this.getRequest(url)
    }

    public clone(adReportTemplateId: number) {
        const url = `${this.serviceUrl}/clone/${adReportTemplateId}`;
        return this.getRequest(url);
    }

    public searchExam(item: any): Observable<any> {
        const url = `${this.serviceUrl}/search`;
        return this.postRequest(url, CommonUtils.convertData(item));
    }

    // public downloadTemplateImport() {
    //     const url = `${this.serviceUrl}/download-template-import`;
    //     return this.getRequest(url,{responseType: 'blob'});
    // }

    public downloadTemplateImport(): Observable<any> {
        const url = `${this.serviceUrl}/download-template-import`;
        return this.getRequest(url, {responseType: 'blob'});
      }
   
     public processImport(data): Observable<any> {
        const url = `${this.serviceUrl}/import`;
        const formdata = CommonUtils.convertFormFile(data);
        return this.postRequest(url, formdata);
    }

    // public processImport(file: File): Observable<any> {
    //     const formData: FormData = new FormData();
    //     formData.append('fileAttachments', file);
    //     const url = `${this.serviceUrl}/import`;
    //     return this.httpClient.post(url, formData);
    //   }

    public getEmpExamHistory(thoroughContentId, employeeId): Observable<any> {
        const url = `${this.serviceUrl}/${thoroughContentId}/${employeeId}`;
        return this.getRequest(url);
    }

    search(data, event?) : Observable<any>{
        let param = {...data};
        const url = `${this.serviceUrl}/search?`;
        param.status = param.status ? param.status.id : '';
        if (event){
          param._search = CryptoService.encrAesEcb(JSON.stringify(event));
        }
        return this.getRequest(url,{params: CommonUtils.buildParams(param)})
      }
}
