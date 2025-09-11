import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';
import { Observable } from 'rxjs';
import { BasicService } from '../basic.service';

@Injectable({
    providedIn: 'root'
})
export class HandlingLetterDenunciationService extends BasicService {

    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'handlingLetterDenunciation', httpClient, helperService);
    }

    public checkIsLastResult(letterDenunciationId: number, handlingLetterDenunciationId: number,settlementDate: number): Observable<any> {
        const url = `${this.serviceUrl}/check-is-last-result/${letterDenunciationId}/${handlingLetterDenunciationId}/${settlementDate}`;
        return this.getRequest(url, { responseType: 'text' });
    }

    public getByLetterDenunciationId(letterDenunciationId: number): Observable<any> {
        const url = `${this.serviceUrl}/get-by-letter-denunciation-id/${letterDenunciationId}`;
        return this.getRequest(url);
    }

}
