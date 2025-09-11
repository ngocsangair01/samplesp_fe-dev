export class SysPropertyDetailBean {
  constructor(_sysProperty: any, _marketCompany: any) {
    this.propertyId = _sysProperty.propertyId;
    this.propertyCode = _sysProperty.code;
    this.propertyName = _sysProperty.name;
    this.actionForm = _sysProperty.actionForm;
    this.resourceCode = _sysProperty.resourceCode;
    this.tableName = _sysProperty.tableName;
    this.columnName = _sysProperty.columnName;
    this.marketCompanyId = _marketCompany.marketCompanyId;
    this.marketCompanyCode = _marketCompany.code;
    this.marketCompanyName = _marketCompany.name;
  }
    actionForm?: string;
    resourceCode?: string;
    propertyCode?: string;
    propertyName?: string;
    marketCompanyCode?: string;
    marketCompanyName?: string;
    propertyDetailId?:  number;
    isHide?:            boolean;
    isTranslation?:     boolean;
    align?:             string;
    dateFormat?:        string;
    numberFormat?:      string;
    moneyFormat?:       string;
    css?:               string;
    js?:                string;
    propertyId?:        number;
    marketCompanyId?:   number;
    isRequire?:         boolean;
    isUrl?:             boolean;
    isNumber?:          boolean;
    isEmail?:           boolean;
    isIp?:              boolean;
    emailFormat?:       boolean;
    minLength?:         number;
    maxLength?:         number;
    numberMin?:         number;
    numberMax?:         number;
    tableName?:         string;
    columnName?:        string;
    numberType?:        string;
    password?:          boolean;
    phone?:             boolean;
    mobileNumber?:      boolean;
    personalIdNumber?:  boolean;
    beforeCurrentDate?: boolean;
  }

