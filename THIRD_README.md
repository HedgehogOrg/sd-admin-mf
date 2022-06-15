# 第三方插件文档

## MobX 6
框架内使用 `MobX 6` 作为状态管理工具

  [https://www.mobxjs.com/](https://www.mobxjs.com/)

## Dayjs
`antd`内置的`Moment.js`插件已经改为`Day.js`，统一使用`Day.js`

  [https://day.js.org/zh-CN/](https://day.js.org/zh-CN/)

## Mockjs
生成随机的mock数据
[http://mockjs.com/](http://mockjs.com/)
   

项目配置作了如下修改：

> 1. 添加了路径别名`@`，对应到项目`src`文件夹，松耦合的组件/文件，建议用别名引入；紧耦合的组件/文件，通过相对路径引入

> 2. 添加了`npm run start:mock`命令，在开发环境使用mock数据，如果要在开发环境使用后台服务器数据，使用`npm run start`命令

> 3. 添加了mockjs生成随机数据，文档地址见项目`THIRD_READMEN.md`

> 4. mock数据分模块放在mock文件夹

> 5. api请求统一放在apis文件夹，分模块管理

> 6. 添加了eslint语法和代码风格检查规则，使用`airbnb-typescript`规则集，确认一下eslint语法提示是否正常，确保开启了vscode的`codeActionsOnSave`，方便开发

> 7. 添加了`npm run lint`通过命令行手动lint

> 8. package.json添加了`precommit`，commit时自动lint

> 9. 通过webpack注入了全局变量`APP_ENV`，值为[dev|test|prod]，可在业务代码中通过`process.env.APP_ENV`访问