import { Component, OnInit, Input, ViewChild, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { APP_CONSTANTS } from '@app/core';
import { BaseControl } from '@app/core/models/base.control';
import { CommonUtils } from '@app/shared/services';
import { BaseComponent } from '../base-component/base-component.component';


@Component({
    selector: 'schedule-selector',
    templateUrl: './schedule-selector.component.html',
})
export class ScheduleSelectorComponent implements OnInit, OnChanges {

    @Input()
    type;

    @Input()
    viewMode;

    @Input()
    property: BaseControl;

    @ViewChild("inputMask") inputMask;

    repeatcycleorder = APP_CONSTANTS.REPEAT_CYCLE_ORDER

    monthOfYear = APP_CONSTANTS.MONTH_OF_YEAR

    quarterlyOption = [
        { label: "Quý 1", value: '1' },
        { label: "Quý 2", value: '2' },
        { label: "Quý 3", value: '3' },
        { label: "Quý 4", value: '4' },
    ]

    monthOfQuarterly = [
        { label: "Tháng đầu tiên", value: 'FIRST' },
        { label: "Tháng thứ hai", value: 'SECOND' },
        { label: "Tháng thứ ba", value: 'THIRD' },
    ]

    weeklyOptions = [
        { label: "Thứ 2", value: '2' },
        { label: "Thứ 3", value: '3' },
        { label: "Thứ 4", value: '4' },
        { label: "Thứ 5", value: '5' },
        { label: "Thứ 6", value: '6' },
        { label: "Thứ 7", value: '7' },
        { label: "Chủ Nhật", value: '1' },
    ]

    monthlyOptions;
    quarterlyOptions = [
        { label: "Tháng 01, 04, 07 hoặc 10", value: '1' },
        { label: "Tháng 02, 05, 08 hoặc 11", value: '2' },
        { label: "Tháng 03, 06, 09 hoặc 12", value: '3' },
    ]
    dayOfquarterly
    monthOfquarterly
    numberOfWeeks               // Số tuần lặp lại
    selectedDay                 // Số ngày trong tuần
    repeatOption: string = '1'  //1: Kiểu lặp theo ngày của tháng + ngày trong năm, 2 Kiểu lặp theo ngày thứ trong tháng + theo ngày - tháng trong năm
    dayOfMonth                  // Lặp vào ngày nào trong tháng
    repeatCycleByDay            // Chu kì lặp sau mỗi bao nhiêu tháng với kiểu lặp theo ngày của tháng
    repeatCycleByOrder          // Chu kì lặp sau mỗi bao nhiêu tháng với kiểu lặp theo thứ trong tháng
    cycleOrder                  // Lần xuất hiện trong tháng FIRST, SECOND, THIRD, FOURTH , LAST
    quarterNumberOfDay          // Quý trong năm
    quarterNumberOfOrder        // Quý trong năm
    monthOfquarterlyOfDay       // Tháng trong quý
    monthOfquarterlyOfOrder     // Tháng trong quý
    dayOfWeek                   // Ngày trong tuần
    lstMonthOfYearByDay         // Tháng trong năm
    lstMonthOfYearByOrder       // Tháng trong năm
    constructor(

    ) {

    }

    ngOnInit() {
        this.getMonthyOptions();
    }

    ngOnChanges() {
        this.resertValueForm()
        if (this.property) {
            this.property.setValue(null);
        }
    }

    getMonthyOptions() {
        this.monthlyOptions = [];
        for (let i = 1; i <= 31; i++) {
            this.monthlyOptions.push({ label: "Ngày " + i, value: "" + i })
        }
    }

    onAnnualBlur() {
        if (this.property.value) {
            let dateString = this.property.value.split("/")[1] + "/" + this.property.value.split("/")[0] + "/1999";
            let date: any = new Date(dateString);
            if (date == "Invalid Date") {
                this.property.setValue(null);
            }
        }
    }

    onChangeQuaterly() {
        if (this.dayOfquarterly && this.monthOfquarterly) {
            this.property.setValue({ date: this.dayOfquarterly.value, month: this.monthOfquarterly.value })
        }
    }

    setPropertyValue(data) {
        if (CommonUtils.isNullOrEmpty(data)) {
            return;
        }
        if (this.type == "TUAN") {
            this.numberOfWeeks = data.repeatCycle;
            this.selectedDay = data.dayOfWeek.split(",");
            this.onChangeByWeek();
        } else if (this.type == "THANG") {
            this.repeatOption = data.repeatOption;
            this.dayOfMonth = data.dayOfMonth;
            this.cycleOrder = this.repeatcycleorder.find(item => item.value == data.repeatCycleOrder);
            if (this.repeatOption == '1' ) {
                this.repeatCycleByDay = data.repeatCycle;
                this.onChangeDayOfMonth()
            } else {
                const dayOfWeek = data.dayOfWeek.split(",")
                const excludeDays = dayOfWeek.map(id=>this.weeklyOptions.find(day=>day.value === id));
                this.dayOfWeek = excludeDays
                this.repeatCycleByOrder = data.repeatCycle;
                this.onChangeByOrder()
            }
        } else if (this.type == "QUY") {
            this.repeatOption = data.repeatOption;
            if (this.repeatOption == "1") {
                this.dayOfMonth = this.monthlyOptions.find(item => item.value == data.dayOfMonth)
                this.quarterNumberOfDay = data.quarterOfYear.split(",")
                this.monthOfquarterlyOfDay = this.monthOfQuarterly.find(item => item.value == data.monthOfQuarter);
                this.onChangeTypeQuarterAndOptionDay();
            } else {
                const dayOfWeek = data.dayOfWeek.split(",")
                const excludeDays = dayOfWeek.map(id=>this.weeklyOptions.find(day=>day.value == id));
                this.dayOfWeek = excludeDays
                this.quarterNumberOfOrder = data.quarterOfYear.split(",")
                this.monthOfquarterlyOfOrder = this.monthOfQuarterly.find(item => item.value == data.monthOfQuarter);
                this.cycleOrder = this.repeatcycleorder.find(item => item.value == data.repeatCycleOrder);
                this.onChangeTypeQuarterAndOptionOrder()
            }
        } else {
            this.repeatOption = data.repeatOption;
            this.cycleOrder = this.repeatcycleorder.find(item => item.value == data.repeatCycleOrder);
            const monthOfYear = data.monthOfYear.split(",")
            const excludeMonth = monthOfYear.map(id => this.monthOfYear.find(day=>day.id == id));
            if (this.repeatOption == "1") {
                this.dayOfMonth = data.dayOfMonth;
                this.lstMonthOfYearByDay = excludeMonth
                this.onChangeTypeYearAndOptionDay();
            } else {
                const dayOfWeek = data.dayOfWeek.split(",")
                const excludeDays = dayOfWeek.map(id=>this.weeklyOptions.find(day=>day.value == id));
                this.dayOfWeek = excludeDays
                this.lstMonthOfYearByOrder = excludeMonth
                this.onChangeTypeYearAndOptionOrder();
            }
        }
    }
    /**
     * onBlockZeros
     * @param event
     */
    onBlockZeros(event) {
        event.target.value = event.target.value.replace(/^0+/, '');
    }

    /**
     * Hàm thay đổi thời gian báo cáo với loại báo cáo là tuần
     */
    onChangeByWeek() {
        this.property.setValue(null)
        if (!CommonUtils.isNullOrEmpty(this.numberOfWeeks) && !CommonUtils.isNullOrEmpty(this.selectedDay)) {
            const selectedDay = this.selectedDay.join(",")
            this.property.setValue({month: this.numberOfWeeks, day: selectedDay})
        }
    }

    /**
     * Hàm thay đổi thời gian báo cáo với loại báo cáo là tháng và Kiểu lặp theo ngày của tháng
     */
    onChangeDayOfMonth() {
        this.repeatOption = '1'
        this.property.setValue(null)
        if (this.repeatOption == '1' && !CommonUtils.isNullOrEmpty(this.dayOfMonth) && !CommonUtils.isNullOrEmpty(this.repeatCycleByDay)) {
            this.property.setValue({repeatOption: this.repeatOption, dayOfMonth: this.dayOfMonth, repeatCycle: this.repeatCycleByDay})
        }
    }

    /**
     * Hàm thay đổi thời gian báo cáo với loại báo cáo là tháng và Kiểu lặp theo ngày thứ trong tháng
     */
    onChangeByOrder(){
        this.repeatOption = '2'
        this.property.setValue(null)
        if (this.repeatOption == '2' && !CommonUtils.isNullOrEmpty(this.dayOfWeek) && !CommonUtils.isNullOrEmpty(this.cycleOrder) && !CommonUtils.isNullOrEmpty(this.repeatCycleByOrder)) {
            const dayOfWeek = this.dayOfWeek.map(item => item.value)
            this.property.setValue({repeatOption: this.repeatOption, dayOfWeek: dayOfWeek.join(","), repeatCycleOrder: this.cycleOrder.value, repeatCycle: this.repeatCycleByOrder})
        }
    }

    /**
     * Hàm thay đổi thời gian báo cáo với loại báo cáo là năm và Kiểu lặp theo ngày của tháng
     */
    onChangeTypeYearAndOptionDay() {
        this.repeatOption = '1'
        this.property.setValue(null)
        if (this.repeatOption == '1' && !CommonUtils.isNullOrEmpty(this.dayOfMonth) && !CommonUtils.isNullOrEmpty(this.lstMonthOfYearByDay)) {
            const monthOfYear = this.lstMonthOfYearByDay.map(item => item.id)
            this.property.setValue({repeatOption: this.repeatOption, dayOfMonth: this.dayOfMonth, monthOfYear: monthOfYear.join(',')})
        }
    }

    /**
     * Hàm thay đổi thời gian báo cáo với loại báo cáo là năm và Kiểu lặp theo ngày thứ trong tháng
     */
    onChangeTypeYearAndOptionOrder() {
        this.repeatOption = '2'
        this.property.setValue(null)
        if (this.repeatOption == '2' && !CommonUtils.isNullOrEmpty(this.dayOfWeek) && !CommonUtils.isNullOrEmpty(this.cycleOrder) && !CommonUtils.isNullOrEmpty(this.lstMonthOfYearByOrder)) {
            const dayOfWeek = this.dayOfWeek.map(item => item.value)
            const monthOfYear = this.lstMonthOfYearByOrder.map(item => item.id)
            this.property.setValue({
                repeatOption: this.repeatOption,
                dayOfWeek: dayOfWeek.join(','),
                repeatCycleOrder: this.cycleOrder.value,
                monthOfYear: monthOfYear.join(',')
            })
        }
    }

    /**
     * Hàm thay đổi thời gian báo cáo với loại báo cáo là quý và kiểu lặp là ngày của tháng trong quý
     */
    onChangeTypeQuarterAndOptionDay() {
        this.repeatOption = '1'
        this.property.setValue(null)
        if (this.repeatOption == '1' && !CommonUtils.isNullOrEmpty(this.dayOfMonth) && !CommonUtils.isNullOrEmpty(this.monthOfquarterlyOfDay) && !CommonUtils.isNullOrEmpty(this.quarterNumberOfDay)) {
            this.property.setValue({
                dayOfMonth: this.dayOfMonth.value,
                repeatOption: this.repeatOption,
                monthOfQuarter: this.monthOfquarterlyOfDay.value,
                quarterOfYear: this.quarterNumberOfDay.join(',')
            })
        }
    }

    /**
     * Hàm thay đổi thời gian báo cáo với loại báo cáo là quý và kiểu lặp là ngày thứ trong quý
     */
    onChangeTypeQuarterAndOptionOrder() {
        this.repeatOption = '2'
        this.property.setValue(null)
        if (this.repeatOption == '2' && !CommonUtils.isNullOrEmpty(this.dayOfWeek) && !CommonUtils.isNullOrEmpty(this.cycleOrder) && !CommonUtils.isNullOrEmpty(this.monthOfquarterlyOfOrder) && !CommonUtils.isNullOrEmpty(this.quarterNumberOfOrder)) {
            const dayOfWeek = this.dayOfWeek.map(item => item.value)
            this.property.setValue({
                repeatOption: this.repeatOption,
                dayOfWeek: dayOfWeek.join(','),
                repeatCycleOrder: this.cycleOrder.value,
                monthOfQuarter: this.monthOfquarterlyOfOrder.value,
                quarterOfYear: this.quarterNumberOfOrder.join(',')
            })
        }
    }

    resertValueForm() {
        this.dayOfquarterly = null;
        this.monthOfquarterly = null;
        this.repeatOption = '1'
        this.selectedDay = null
        this.dayOfMonth = null
        this.repeatCycleByOrder = null
        this.cycleOrder = null
        this.quarterNumberOfDay = null
        this.quarterNumberOfOrder = null
        this.monthOfquarterlyOfDay = null
        this.monthOfquarterlyOfOrder = null
        this.dayOfWeek = null
        this.lstMonthOfYearByDay = null
        this.lstMonthOfYearByOrder = null
        this.numberOfWeeks = this.type == "TUAN" ? 1 : null; // bổ sung nội dung bug #241: [BUG ID: 4752] Yêu cầu báo cáo - T/h BC tuần thì mặc định là mỗi 1 tuần
        this.repeatCycleByDay = this.type == "THANG" ? 1 : null; // bổ sung nội dung bug #241: [BUG ID: 4752] Yêu cầu báo cáo - T/h BC tuần thì mặc định là mỗi 1 tuần
    }

}