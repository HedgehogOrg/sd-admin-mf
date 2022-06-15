import { Spin } from 'antd';
import { Suspense } from 'react';
import { myRouters } from 'Remote/Router';
import SuspenseWithPromise from '../SuspenseWithPromise';

function WaitForRouterReady({ children, fallback = <Spin /> }: { children: any, fallback?: any }) {
  // 等待获取firstPath
  function waitForFirstPath() {
    return new Promise((resolve) => {
      function check() {
        if (!myRouters.firstPath) {
          window.requestAnimationFrame(check);
        } else {
          resolve(true);
        }
      }
      window.requestAnimationFrame(check);
    });
  }

  return (
    <Suspense fallback={fallback}>
      <SuspenseWithPromise promise={waitForFirstPath()}>
        {children}
      </SuspenseWithPromise>
    </Suspense>
  );
}

export default WaitForRouterReady;
