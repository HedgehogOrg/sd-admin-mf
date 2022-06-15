// / <reference types="react-scripts" />

declare module '*.module.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

/* 用于 微前端 qiankun */
interface Window {
  __POWERED_BY_QIANKUN__: null
}

/* 模块联邦 */
declare module 'Remote/*' {
  const classes: ComponentType<any>;
  export const myRouters: ComponentType<any>;
  export const userStore: ComponentType<any>;
  export const request: ComponentType<any>;
  export const permissionsStore: ComponentType<any>;
  export const permissionCollection: ComponentType<any>;
  export default classes;
}

/* 模块联邦 */
declare module 'Console/*' {
  const classes: ComponentType<any>;
  export default classes;
}

/* 公用基础架构参数 */
interface ProjectProps {
  lang: Language;
  allRoutes: MenuDataItem[];
  TopBarLogout: () => JSX.Element;
  interceptors?: Function;
  permissionCollection: object;
}
