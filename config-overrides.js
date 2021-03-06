const { override, fixBabelImports, addWebpackPlugin, addWebpackAlias, addBabelPlugin } = require('customize-cra');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const addLessLoader = require('./plugins/addLessLoader_forCRA5');
const mockMiddleware = require('./plugins/mock-middleware');
const pkg = require('./package.json');
const path = require('path');
const webpack = require('webpack');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const packageJsonDeps = require('./package.json').dependencies;

process.env.REACT_APP_PROJECT_NAME = pkg.name;

module.exports = {
  webpack: override(
    (config) => {
      config.output.library = pkg.name;
      config.output.libraryTarget = 'umd';
      /* 用于 微前端 qiankun */
      config.output.publicPath = process.env.REACT_APP_PUBLIC_PATH;
      return config;
    },
    fixBabelImports("import", {
      libraryName: "antd",
      libraryDirectory: "es",
      style: true, //自动打包相关的样式 默认为 style:'css'
    }),
    addLessLoader({
      lessOptions: {
        javascriptEnabled: true,
        // modifyVars: { "@primary-color": "#1DA57A" }, // 修改默认主题
      }
    }),
    // 路径别名，紧密耦合的文件/组件建议用相对路径引入
    addWebpackAlias({
      "@": path.resolve(__dirname, "src")
    }),
    // 替换 moment 为 dayjs
    addWebpackPlugin(new AntdDayjsWebpackPlugin()),
    // 业务代码中可通过process.env.APP_ENV访问到.env[development|test|production]中设置的环境变量
    addWebpackPlugin(new webpack.DefinePlugin({
      "process.env.APP_ENV": JSON.stringify(process.env.APP_ENV),
      "process.env.BASE_URL": JSON.stringify(process.env.BASE_URL),
      "process.env.USE_MOCK": JSON.stringify(process.env.USE_MOCK)
    })),
    addWebpackPlugin(new ModuleFederationPlugin({
      remotes: {
        Remote: `remote@${process.env.MODULE_FEDERATION_REMOTE}remoteEntry.js`,
        Console: `Console@${process.env.MODULE_FEDERATION_CONSOLE}remoteEntry.js`,
      },
      shared: {
        "@ant-design/pro-skeleton": { singleton: true, eager: true, requiredVersion: packageJsonDeps["@ant-design/pro-skeleton"] },
        "@ant-design/icons": { singleton: true, eager: true, requiredVersion: packageJsonDeps["@ant-design/icons"] },
        "axios": { singleton: true, eager: true, requiredVersion: packageJsonDeps["axios"] },
        "react": { singleton: true, eager: true, requiredVersion: packageJsonDeps["react"] },
        "react-dom": { singleton: true, eager: true, requiredVersion: packageJsonDeps["react-dom"] },
        "react-router-dom": { singleton: true, eager: true, requiredVersion: packageJsonDeps["react-router-dom"] },
        "antd": { singleton: true, eager: true, requiredVersion: packageJsonDeps["antd"] },
        "mobx": { singleton: true, eager: true, requiredVersion: packageJsonDeps["mobx"] },
        "mobx-react": { singleton: true, eager: true, requiredVersion: packageJsonDeps["mobx-react"] },
        "react-intl-universal": { singleton: true, eager: true, requiredVersion: packageJsonDeps["react-intl-universal"] },
        "moment": { singleton: true, eager: true, requiredVersion: packageJsonDeps["dayjs"] },
      },
    }))
  ),
  devServer: override(
    (configFunction) => {
      return function(proxy, allowedHost) {
        const config = configFunction(proxy, allowedHost);
        config.headers = {
          /* 用于 微前端 qiankun 开发*/
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Method': 'GET, HEAD, OPTIONS, POST, PUT',
          'Access-Control-Allow-Headers': '*'
        };

        // 在开发环境中且USE_MOCK时，使用mock数据
        if(process.env.APP_ENV === 'dev' && process.env.USE_MOCK) {
          config.setupMiddlewares = (middlewares, devServer) => {
            /* mock */
            middlewares.push(mockMiddleware);
            return middlewares;
          };
        }

        return config;
      };
    }
  )
};
