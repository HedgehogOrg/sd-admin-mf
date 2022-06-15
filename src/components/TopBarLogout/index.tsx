import {
  ReactChild, ReactFragment, ReactPortal, useState,
} from 'react';
import {
  Dropdown, Menu, Avatar, Button, message, Image, MessageArgsProps,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PasswordChangeModal from 'Remote/PasswordChangeModal';
import userStore from '@/stores/auth/UserStore';
import { useIntl } from '@/utils/intl';
import SelectLanguage from '../SelectLanguage';
import styles from './index.module.less';

function TopBarLogout() {
  const t = useIntl('login');
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const { avatar } = userStore.user;
  const defaultAvatar = '/assets/login/default_avatar.png';

  const logoutHandler = () => {
    userStore.logout().then(() => {
      navigate('/login');
    }).catch((error: { message: boolean | ReactChild | ReactFragment | ReactPortal | MessageArgsProps | null | undefined; }) => {
      message.error(error.message);
    });
  };

  const changePasswordHandler = () => {
    setIsModalVisible(true);
  };

  const handleOk = (values: any) => {
    setLoading(true);
    console.warn(userStore.user.id);
    const params = { ...values, id: userStore.user.id };

    userStore.changePassword(params).then(() => {
      setIsModalVisible(false);
      message.success(t('CHANGE_PASSWORD_SUCCESS'), 2);
      setTimeout(() => {
        userStore.clear();
      }, 1000);
    }).catch((error: { statusCode: number; message: boolean | ReactChild | ReactFragment | ReactPortal | MessageArgsProps | null | undefined; }) => {
      if (error.statusCode === 400) {
        message.error(error.message);
      }
    }).finally(() => {
      setLoading(false);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const menu = (
    <Menu
      className={styles['system-menu']}
      items={[{
        key: '1',
        label: (
          <Button
            type="link"
            onClick={changePasswordHandler}
          >
            {t('CHANGE_PASSWORD')}
          </Button>
        ),
      }, {
        key: '2',
        label: (
          <Button
            type="link"
            onClick={logoutHandler}
          >
            {t('LOGOUT')}
          </Button>
        ),
      }]}
    />
  );

  return (
    <div className={styles.view}>
      <SelectLanguage />

      <span className={styles['org-name']}>{userStore.user.organization?.name || '' }</span>

      <Dropdown overlay={menu} placement="bottomRight" arrow>
        <Button type="ghost" className={styles['drop-down-button']}>
          <Avatar
            shape="circle"
            size="default"
            src={<Image preview={false} src={avatar || defaultAvatar} />}
          />
          <span className={styles['item-space']}>{userStore.user?.name || ''}</span>
          <DownOutlined />
        </Button>
      </Dropdown>

      <PasswordChangeModal
        loading={loading}
        isModalVisible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default TopBarLogout;
