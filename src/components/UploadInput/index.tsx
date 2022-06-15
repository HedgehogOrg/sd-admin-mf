/* eslint-disable no-param-reassign */
import {
  CSSProperties,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import {
  Upload,
  Button,
  message,
  Modal,
} from 'antd';
import {
  UploadOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  UploadChangeParam,
  RcFile,
  UploadFile,
  UploadListType,
} from 'antd/lib/upload/interface';
import OSS from 'ali-oss';
import {
  UploadFileType,
  OSSInfo,
} from './type.d';
import { getOSSInfo } from '@/apis/upload';
import suffixToMimeMap from './suffix2mime';

/**
 * @props value
 * @props children                           用于自定义上传组件按钮，以组件子元素的方式传入
 * @props disabled                           是否禁用
 * @props accept                             接受的文件类型，如：.jpg，多个类型用逗号连接，如：.jpg,.mp4,.pdf等
 * @props fileType                           文件类型，可选file和img，默认为file
 * @props btnText                            自定义文件上传（fileType="file"）按钮文字，默认为“选择文件”
 * @props btnStyle                           自定义文件上传（fileType="file"）按钮样式
 * @props fileSize                           限制单个文件大小，单位MB
 * @props maxCount                           限制文件上传数量，默认1
 * @props isCustomRequest                    自定义上传，上传到ali-oss时必须传true
 * @props ossActionType                      用于请求ali-oss临时凭证的类型参数，isCustomRequest为true时必传，参见./type.d.ts类型定义：OssUploadFileType
 * @props onSuccess(file: UploadFile)        单个文件上传成功回调
 * @props onChange(fileList: UploadFile[])   上传变更回调，在Form.Item中使用时，不需要手动传入
 * @props isManual                           是否手动上传，默认自动上传
 */

export interface UploadInputProps {
  value?: [],
  children?: ReactElement,
  disabled?: boolean,
  accept?: string,
  fileType?: 'img' | 'file',
  btnText?: string,
  btnStyle?: CSSProperties,
  fileSize?: number,
  maxCount?: number;
  isCustomRequest?: boolean;
  ossActionType?: string,
  isManual?: boolean,
  onChange?: Function,
  onSuccess?: Function,
}

/**
 * oss上传成功后
 * 1. 单个文件，通过fileList[0].url获取文件url
 * 2. 多个文件，通过fileList.map((item) => item.url)获取url列表
 */

/**
 * 图片/文件编辑
 * 使用Form.Item时，initialValue传入如下格式数组
 * [{
 *   uid: number | string, // 不可以重复，可以传数组index
 *   name: string,         // 文件名，自定义字符串
 *   status: 'done',       // 固定值'done'
 *   url: string,          // 接口返回的url
 * }]
 */

const excepts = ['.pptx', '.xls', '.xlsx']; // macOS传mime给antd上传组件无法识别

function getBase64(file: RcFile | undefined) {
  if (!file) return '';
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function UploadInput(props: UploadInputProps) {
  const {
    value,
    children,
    disabled,
    accept,
    btnText,
    btnStyle,
    isManual,
    fileType = UploadFileType.FILE,
    fileSize,
    maxCount = 1,
    isCustomRequest,
    ossActionType,
    onChange,
    onSuccess,
  } = props;
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<any>();

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'done') {
      if (onSuccess) {
        onSuccess(info.file);
      }
      message.success(`${info.file.name} 上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败.`);
    }

    let tempFileList = [...info.fileList];

    tempFileList = tempFileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });

    tempFileList = tempFileList.filter((file) => file.status);

    triggerChange(tempFileList);
    setFileList(tempFileList);
  };

  const triggerChange = (changedFileList: UploadFile[]) => {
    if (onChange) {
      onChange(changedFileList);
    }
  };

  const handleRemove = (file: UploadFile) => {
    console.log('===onremove===', file);
    // noop
  };

  const handlePreview = async (file: UploadFile) => {
    if (fileType === UploadFileType.IMAGE) {
      let previewUrl;

      if (file.originFileObj) {
        previewUrl = await getBase64(file.originFileObj);
      } else {
        previewUrl = file.url;
      }

      setPreviewImage(previewUrl);
      setPreviewVisible(true);
    }
  };

  const onPreviewCancel = () => {
    setPreviewVisible(false);
  };

  const handleBeforeUpload = (file: RcFile) => {
    // 限制文件大小，单位MB
    if (fileSize && file.size / 1024 / 1024 > fileSize) {
      message.error(`文件大小必须在${fileSize}M以下`);
      return Upload.LIST_IGNORE;
    }

    // 检查文件格式
    if (!checkAccept(file)) {
      message.error(`请选择以下格式：${accept}`);
      return Upload.LIST_IGNORE;
    }

    return isCustomRequest || !isManual;
  };

  const checkAccept = (file: RcFile) => {
    const { name, type } = file;
    if (!accept) return true;
    const mimeArr = getMimeAccept(accept).split(',');
    if (type && mimeArr.some((v) => v.toLowerCase() === type.toLowerCase())) return true;
    const acceptArr = accept.split(',');
    return acceptArr.some((v) => (new RegExp(`${v.toLowerCase()}$`).test(name.toLowerCase())));
  };

  const getMimeAccept = (acceptTypes: string | undefined) => {
    if (!acceptTypes) return '';
    const acceptArr = acceptTypes.split(',');
    return acceptArr.map((acc) => {
      const accLow = acc.toLowerCase();
      if (excepts.indexOf(accLow) > -1) return acc.toUpperCase();
      return (suffixToMimeMap as any)[accLow] || accLow;
    }).join(',');
  };

  const handleCustomRequest = async (options: any) => {
    const { file, onSuccess: handleSuccess, onError } = options;

    if (!ossActionType) {
      message.error('上传ali-oss需携带ossActionType参数');
      onError();
      return;
    }

    try {
      const sts: OSSInfo = await getOSSInfo(ossActionType);
      const client = new OSS({
        accessKeySecret: sts.accessKeySecret,
        accessKeyId: sts.accessKeyId,
        stsToken: sts.securityToken,
        region: sts.region,
        bucket: sts.bucket,
      });

      const result = await client.put(
        `${sts.directory}/${file.uid}_${file.name}`,
        file,
      );

      handleSuccess(result, file);
    } catch (err) {
      console.error(err);
      onError();
    }
  };

  useEffect(() => {
    if (value && value.length) {
      if (value.length > maxCount) {
        message.error('传入的图片数量超出了maxCount限制');
        return;
      }
      setFileList(value);
    }
  }, [value]);

  const commonProps = {
    disabled,
    accept: getMimeAccept(accept),
    fileList,
    listType: 'picture-card' as UploadListType,
    maxCount,
    onChange: handleChange,
    onRemove: handleRemove,
    onPreview: handlePreview,
    beforeUpload: handleBeforeUpload,
  };

  const imgButton = fileList.length < maxCount && (children || <PlusOutlined />);

  // 文件自定义上传ali-oss
  const fileCustomUpload = (
    <Upload
      {...commonProps}
      listType="text"
      customRequest={(options) => handleCustomRequest(options)}
    >
      {children || (
        <Button
          icon={<UploadOutlined />}
          style={btnStyle}
          disabled={disabled}
        >
          {btnText || '选择文件'}
        </Button>
      )}
    </Upload>
  );

  // 图片自定义上传ali-oss
  const imgCustomUpload = (
    <Upload
      {...commonProps}
      customRequest={(options) => handleCustomRequest(options)}
    >
      {imgButton}
    </Upload>
  );

  // 图片自动上传，参考与Upload组件用法一致
  // TODO:项目目前统一使用ali-oss上传，后续需要上传到公司服务器时完善
  const imgAutoUpload = (
    <Upload
      {...commonProps}
      name=""
      data={{}}
      headers={{}}
      action=""
      onChange={handleChange}
    >
      {imgButton}
    </Upload>
  );

  // 图片手动上传
  const imgManualUpload = (
    <Upload {...commonProps}>
      {imgButton}
    </Upload>
  );

  return (
    <span>
      {fileType === UploadFileType.FILE && isCustomRequest && fileCustomUpload}
      {fileType === UploadFileType.IMAGE && isCustomRequest && imgCustomUpload}
      {fileType === UploadFileType.IMAGE && !isManual && !isCustomRequest && imgAutoUpload}
      {fileType === UploadFileType.IMAGE && isManual && !isCustomRequest && imgManualUpload}

      <Modal
        visible={previewVisible}
        footer={null}
        width={700}
        onCancel={onPreviewCancel}
      >
        <img alt="图片预览" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </span>
  );
}

export default UploadInput;
