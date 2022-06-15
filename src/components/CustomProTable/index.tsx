import ProTable, { ProTableProps } from '@ant-design/pro-table';
import WithConfigProvider from '../WithConfigProvider';

function CustomProTable<T = void, U = void>(props: ProTableProps<any, any>) {
  // 为保持Table样式和行为统一，尽量使用默认配置，无法满足需求时可覆盖默认配置
  const defaultProps = {
    rowKey: 'id',
    scroll: { x: 800 },
    options: false as const,
    defaultSize: 'large' as const,
    revalidateOnFocus: false,
    pagination: {
      showQuickJumper: true,
      showSizeChanger: true,
    },
  };

  const { pagination } = props;
  const paginationConfig = pagination ? { ...pagination, ...defaultProps.pagination } : defaultProps.pagination;

  return (
    <WithConfigProvider>
      <ProTable<T, U>
        {...defaultProps}
        {...props}
        pagination={paginationConfig}
      />
    </WithConfigProvider>
  );
}

export default CustomProTable;
