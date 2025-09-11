import {Injectable} from '@angular/core';

@Injectable()
export class MenuService {
    private listParentId: any[];

    constructor() {
    }

    getListMenuId() {
        return this.listParentId;
    }

    setListMenuId(listParentId: any[]) {
        this.listParentId = listParentId;
    }
}
