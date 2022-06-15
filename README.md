# Admin with Antd Pro and Mobx

   > 由Antd Pro + Mobx 搭建的，基于模块联邦基座的 Admin

## webpack 配置(注意！！！)
    1. 内含 `output.publicPath` 为 qiankun 而配置，**上线前按需配置**
    2. 使用 `customize-cra` 而不 `eject`
    3. webpack 插件 放到 `./plugins` 内

## mock数据
    本地mock数据在`./mock/index.js`下

## 文件/组件引入
    项目别名`@`，对应`src`文件夹
    松耦合的文件/组件，建议通过别名引入；紧耦合的，建议通过相对路径引入

## 命名规范
    | 类型 | 规范 | 例子 |
    | --- | --- | --- |
    | 文件夹 | kebab-case（小写，中划线） | error-page |
    | 页面 / 组件 / 类文件（少于500行） | PascalCase（大驼峰） | UserList.tsx |
    | 普通 js / ts 文件（少于500行） | kebab-case | request.ts |
    | 非公用的样式文件（少于500行） | kebab-case，带module | login.module.less |
    | 图片文件 | 小写，下划线 | icon_logo_200x50.png |
    | 样式（用less） class / id | kebab-case | .login-form, #pro-layout |
    | js / ts 变量 / 函数 | camelCase（小驼峰） | setToken |
    | js / ts 常量 | 全大写 | BASE_URL |


## 目录结构/规范

```
├── src
│   ├── App.tsx                           // 根组件
│   ├── components                        // 公用组件库
│   │   └── PageLayout
│   │       └── index.tsx                 // 登录后的页面布局
│   ├── config                            // 全局业务配置
│   ├── index.tsx                         // 入口文件
│   ├── locales                           // 多语言模块
│   ├── modules                           // 业务模块
│   │   ├── dashboard                     // 模块名称
│   │   │   ├── components                // 模块内组件库
│   │   │   │   ├── ChartsArea.tsx        // 模块内使用的组件
│   │   │   │   └── chart.module.less     // 私有样式需带.module
│   │   │   └── pages                     // 模块下的页面文件夹
│   │   │       └── Dashboard.tsx         // 模块下的页面
│   ├── routes
│   │   ├── index.tsx                     // 路由入口
│   ├── stores                            // Mobx数据储存模块
│   ├── styles                            // 公用样式
│   ├── types                             // TS类型文件
│   └── utils                             // 工具库
```

## GET请求约定
与服务端约定的请求规范[在TAPD](https://www.tapd.cn/45384922/documents/show/1145384922001000289?file_type=word)

关于GET请求查询，做了以下通用处理：
1. 普通数组 in 查询：传正常数组；
2. 普通数组 not in 查询：传正常数组，字段前 + “ ! ”；
3. attributes字段：传正常数组；
4. expand字段：传字符串、数组、对象字面量都行；

## 菜单/按钮权限约定
详情请看 [PERMISSION_README.md](./PERMISSION_README.md)

## 运行脚本

开发

 [http://localhost:8870](http://localhost:8870)


    npm start

注：若要在开发环境使用mock数据

    npm start:mock

[测试](https://facebook.github.io/create-react-app/docs/running-tests)

    npm test


 打包项目到 `build` 文件夹

    npm run build

 使用`env-cmd`可以指定环境变量运行脚本

 如：使用生成环境的环境变量来开发

   ```
   // "start:prod": "env-cmd -f .env.production react-app-rewired start"

   npm run start:prod
   ```

