import { useEffect, useState } from 'react';
import { message } from 'antd';
import userStore from '@/stores/auth/UserStore';
import { useIntl } from '@/utils/intl';

function useAutoLogin(props: { code: string | null }) {
  const { code } = props;
  const [isFetching, setIsFetching] = useState<boolean>(true);

  // 多语言
  const i18n = useIntl('login');
  const error = useIntl('error');

  useEffect(() => {
    let mounted = true;

    // 通过授权码code登录
    if (code) {
      userStore.loginWithCode({ code }, { showErrorMessage: false }).finally(() => {
        if (mounted) {
          setIsFetching(false);
        }
      }).catch((err: { code: string; }) => {
        if (err.code === 'NOT_FOUND') {
          message.error(i18n('ACCOUNT_NOT_FOUND'));
        } else {
          message.error(error(err.code));
        }
      });
    }

    return () => { mounted = false; };
  }, []);

  if (!code) {
    return false;
  }

  return isFetching;
}

export default useAutoLogin;
