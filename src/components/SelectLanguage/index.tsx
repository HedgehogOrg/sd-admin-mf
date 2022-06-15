import { Dropdown, Menu, Tag } from 'antd';
import userStore from '@/stores/auth/UserStore';
import Lang from '@/locales/index';

function SelectLanguage() {
  const LanguageList = (
    <Menu
      selectedKeys={[userStore.language]}
      items={Lang.languages.map((item) => (
        {
          key: item.value,
          label: item.name,
          onClick: () => userStore.setLanguage(item.value),
        }
      ))}
    />
  );

  return (
    <Dropdown overlay={LanguageList} placement="bottomRight">
      <Tag color="cyan">{Lang.languages.find((lan) => lan.value === userStore.language)?.name}</Tag>
    </Dropdown>
  );
}

export default SelectLanguage;
