export class UserPermission {
  grantedDomain: string;
  operationCode: string;
  resourceCode: string;
  defaultDomain: number;
}

export class UserMenu {
  name: string;
  code: string;
  url: string;
  routerLink: string;
  reourceKey: string;
  sortOrder: number;
  sysMenuId: number;
  parentId: number;
  isActive: boolean;
  icon: string;
  backgroundImage: string;
  backgroundImageBold: string;
  fullName: string;
}

export class UserToken {
  access_token: string;
  email: string;
  employeeCode: string;
  expires_in: number;
  fullName: string;
  loginName: string;
  phoneNumber: string;
  userId: number;
  loginTime: number;
  tokenExpiresIn: number;
  userPermissionList: UserPermission[];
  userMenuList: UserMenu[];
  userInfo: any;
}
