import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, HostListener} from '@angular/core';
import {CommonUtils} from '@app/shared/services';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'table-footer',
    templateUrl: './table-footer.component.html',
    styleUrls: ['./table-footer.component.css']
})
export class TableFooterComponent implements OnInit, OnChanges {
    parseInt = parseInt;
    commonUtils: CommonUtils;
    rowOptions = [{label: 10}, {label: 20}, {label: 30}, {label: 40}, {label: 50}, {label: 100}, {label: 200}];
    totalWidth = false;
    @Output() changeRow = new EventEmitter();
    @Input() public resultList: any;
    selectedRowOption: any; // giá trị được gán lúc bắt đầu

    constructor() {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.resultList.currentValue) this.resultList = changes.resultList.currentValue;
        // console.log(this.activeModal.close())
    }

    ngOnInit() {
        this.buildWidthContain(this.totalWidth);
        this.changeRow.emit(10);
    }

    buildWidthContain(atotalWidth) {
        const menuItems = document.getElementsByClassName('ui-paginator-element');

        const open = document.getElementsByClassName('modal-open');
        let vtDiv = false
        Array.prototype.forEach.call(open, function (el) {
            (el) ? vtDiv = true : vtDiv = false;
        });
        this.totalWidth = vtDiv

        // }
        // console.log(this.totalWidth)
        // const leftFooter = document.getElementsByClassName('ui-paginator-left-content');
        // let totalWidth = 0;
        // Array.prototype.forEach.call(menuItems, function (el) {
        //     totalWidth += el.offsetWidth;
        //     atotalWidth = totalWidth
        // });
        // Array.prototype.forEach.call(leftFooter, function (el) {
        //     el.style.width = `calc(100% - ${totalWidth}px)`;
        // });
        // console.log(atotalWidth)
    }

    onChangeOption(event) {
        this.changeRow.emit(event.value.label);
    }

    @HostListener('click',['$event'])
    modalListener(event) {
        const leftFooter = document.getElementsByClassName('btn btn-span btn-sm btn-info');
    }
    // reset về giá trị mặc định lúc đầu khi mở lại trang
    resetDropdown() {
        this.selectedRowOption = this.rowOptions[0];
    }
}
