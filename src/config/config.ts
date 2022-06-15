// 项目内业务相关的配置(使用了模块联邦，所以在bootstrap.tsx覆盖配置)
const Config = {
  // API请求的baseUrl
  BASE_URL: localStorage.getItem('BASE_URL')?.toString(),
  PLATFORM: parseInt(localStorage.getItem('PLATFORM') || '0', 10),
};

export default Config;
