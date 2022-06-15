# 菜单/按钮 权限

### 按钮

  按钮动作编号请看[系统菜单按钮编号](https://alidocs.dingtalk.com/i/team/pyjzZVdqrbdKMzwx/docs/pyjzZvWle1lwyzwx?corpId=ding7028cfa3897daa84&iframeQuery=sheet_range%3Dkgqie6hm_16_2_3_1)

  **新增模块时需按排序规则依次添加到表格里面**


### 菜单

  >   1. 除了含有 hideInMenu 字段的隐藏路由外，其他**可见菜单层级按管理后台配置**，代码保留层级方便维护
  >   2. path 字段优先采用管理后台配置
  >   3. permission 字段对应权限数据中的 menu字段
  >   4. **hideInMenu 隐藏路由的权限跟随父级**

#### 例子

```js

/**
 * Route Item 类型，除了 permission/component/icon 字段，其他参考 MenuDataItem
 */
import { MenuDataItem } from '@ant-design/pro-layout';

const SystemRoute = {
  name: 'SYSTEM', // 模块名称（多语言字段）去掉之前定义 'menu.SYSTEM' 中的 'menu.'
  permission: 'SYSTEM', // 菜单权限字段（对应管理后台新建模块'菜单'属性 menu 字段）
  icon: <SettingOutlined />, // 一级菜单才有icon（后面需抽离对照表，因为会使用自定义图标）
  routes: [ // 子级
    {
      path: 'system-modules', // 菜单的路由
      name: 'SYSTEM_MODULES',
      permission: 'SYSTEM_MODULES',
      component: <Modules />, // 路由对应的组件
    },
    {
      path: 'role-list',
      name: 'ROLE',
      permission: 'ROLE',
      component: <RoleList />,
      routes: [{
        path: 'create-role',
        name: 'CREATE_ROLE',
        component: <CreateRole />,
        hideInMenu: true, // 隐藏的路由，权限跟随父级
      }, {
        path: 'edit-role/:id',
        name: 'EDIT_ROLE',
        component: <EditRole />,
        hideInMenu: true,
      }],
    },
    {
      name: 'USER',
      permission: 'USER',
      icon: <TeamOutlined />,
      routes: [{
        // 三级菜单
        path: 'user-list',
        name: 'USER_LIST',
        permission: 'USER_LIST',
        component: <UserList />,
        routes: [{
          path: 'user-detail/:id',
          name: 'USER_DETAIL',
          component: <UserDetail />,
          hideInMenu: true,
        }],
      }],
    },
  ],
};


```