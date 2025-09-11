import { FormGroup } from '@angular/forms';
import { BaseControl } from '@app/core/models/base.control';

export interface ReportInputGenerateComponent {
    control: BaseControl;
    formGroup?: FormGroup;
    label: string;
    selectData?: [];
    labelFrom?: string;
    labelTo?: string;
}