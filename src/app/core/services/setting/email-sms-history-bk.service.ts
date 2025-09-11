import { Injectable } from '@angular/core';
import { BasicService } from '../basic.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from '@app/shared/services/helper.service';
import {Observable} from "rxjs";
import {CommonUtils} from "@app/shared/services";

@Injectable({
    providedIn: 'root'
})
export class EmailSmsHistoryBkService extends BasicService {

    constructor(public httpClient: HttpClient, public helperService: HelperService) {
        super('political', 'email-sms-history-bk', httpClient, helperService);
    }
}
