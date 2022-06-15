// / <reference path="./types/index.d.ts" />

import { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, useSearchParams } from 'react-router-dom';
// 公用的基础架构
import Router from 'Remote/Router';
import './styles/global.css';

/* 项目个性化配置 start */
import { FullscreenLoading, SpinLoading, TopBarLogout } from './components';
import lang from '@/locales/index';
import { useAutoLogin } from './hooks';

// 普通路由模块
import allRoutes from './routes';
import permissionCollection from './permission';

/**
 * 云医点击进入组织，url携带code获取token自动登录
 */
function interceptors() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const isFetching = useAutoLogin({ code });
  if (isFetching) {
    return <FullscreenLoading tip="登录中..." />;
  }
  return isFetching;
}

/* 项目个性化配置 end */

/* 用于 微前端 qiankun */
let basename:any;
if (window.__POWERED_BY_QIANKUN__) {
  basename = `/${process.env.REACT_APP_PROJECT_NAME}`;
}

const render = (props?: any) => {
  ReactDOM.render(
    <HashRouter basename={basename}>
      <Suspense fallback={<SpinLoading />}>
        <Router lang={lang} permissionCollection={permissionCollection} allRoutes={allRoutes} TopBarLogout={TopBarLogout} interceptors={interceptors} />
      </Suspense>
    </HashRouter>,
    props.container ? props.container.querySelector('#root') : document.getElementById('root'),
  );
};

/* 非qiankun的独立运行状态下 */
if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log('react app bootstraped');
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props: any) {
  render(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props: any) {
  ReactDOM.unmountComponentAtNode(
    props.container ? props.container.querySelector('#root') : document.getElementById('root'),
  );
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props: any) {
  console.log('update props', props);
}
