import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonUtils } from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { BasicService } from '../basic.service';

@Injectable({
    providedIn: 'root'
})
export class LetterDenunciationService extends BasicService {

    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'letterDenunciation', httpClient, helperService);
    }

    public generateLetterDenunciationCode(type: number, year: number): Observable<any> {
        const url = `${this.serviceUrl}/generate-letter-denunciation-code/${type}/${year}`;
        return this.getRequest(url, { responseType: 'text' });
    }

    public decline(data: any) {
        const url = `${this.serviceUrl}/decline`;
        return this.postRequest(url, CommonUtils.convertFormFile(data));
    }

}
