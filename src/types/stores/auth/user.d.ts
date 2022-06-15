/**
 * File: inde.d.ts
 * Project: sd-console-web
 * FilePath: /src/types/stores/auth/inde.d.ts
 * Created Date: 2022-04-22 13:46:47
 * Author: diya
 * -----
 * Last Modified: 2022-04-22 14:17:38
 * Modified By: diya
 * -----
 * Description:
 */

// 登录的数据结构
export interface LoginType {
  account: string,
  password: string,
  remember?: boolean
}

// 权限的数据结构
export interface PermissionType {
  menu: string,
  children?: PermissionType[]
}

// 用户的数据结构
export interface UserType {
  id: number,
  organizationId: number,
  account: string,
  avatar: string,
  createdAt: number,
  creatorId: number,
  deletedAt: number | null,
  mobile: string,
  name: string,
  isSuper: boolean,
  organizationId: number,
  organization: {
    id: number,
    name: string,
    systemLogo: string,
    systemName: string,
  },
  remark: string | null,
  roleId: number,
  status: number,
  title: string,
  token: string,
  updatedAt: number,
}

export type PasswordMutateType = {
  id?: number,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
};
