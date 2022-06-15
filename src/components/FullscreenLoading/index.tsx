import { ReactNode } from 'react';
import { Spin } from 'antd';

export default function FullscreenLoading(props: { tip?: string | ReactNode }) {
  const { tip } = props;
  const containerStyle = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return <div style={containerStyle}><Spin tip={tip} /></div>;
}
