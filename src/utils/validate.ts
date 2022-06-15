import { FormInstance } from 'antd';

/**
 * antd form组件的自定义 validate方法  校验输入长度
 * @params    form     antd的 form 组件实例对象
 * @params    target   antd的 form 组件item的目标自定义校验的 名称
 * @params    type     校验方案，可拓展（ps:0 默认方案--裁剪原数据，不报错 |1 方案1--不裁剪原数据，报错）
 * @params    targetName     自定义校验的目标名称
 * @params    max     最大长度
 * @params    min     最小长度
 *  */
export const validateLength = (form: FormInstance<any>, target: string, targetName: string, type: number = 0, max = 0, min = 0) => {
  const { getFieldValue, setFieldsValue } = form;
  return {
    validator: async (_: any, value: string) => {
      if (type === 0) {
        if (!value || getFieldValue(target) === value) {
          if (!value) return Promise.resolve();
          let temp: string = value.toString().trim();
          temp = temp.slice(0, max);
          const data = Object.create(null);
          data[`${target}`] = temp;
          setFieldsValue(data);
          return Promise.resolve();
        }
      } else if (type === 1) {
        if (!value || getFieldValue(target) === value) {
          if (!value) return Promise.resolve();
          const temp: string = value.toString().trim();
          if (!(temp.length <= max && temp.length >= min)) {
            throw new Error(`${targetName}长度${min}～${max}字符!`);
          } else {
            return Promise.resolve();
          }
        }
      }
      return Promise.resolve();
    },
  };
};

/**
 * 禁止输入空格
 * @param form    antd form表单实例
 * @param field   antd form表单字段名
 * @returns       Promise
 */
export const replaceSpace = (form: FormInstance<any>, field: string) => {
  const { getFieldValue, setFieldsValue } = form;

  return {
    validator: async (_: any, value: string) => {
      if (!value || getFieldValue(field) === value) {
        const temp: string = value.toString().trim();

        const data = Object.create(null);
        data[`${field}`] = temp;

        setFieldsValue(data);

        return Promise.resolve();
      }

      return Promise.resolve();
    },
  };
};
