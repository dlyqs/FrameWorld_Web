# FrameWorld_Web
dlyqs的个人网站项目，基于Nuxt3+Django的前后端框架，包含影视资源导航搜索、ChatGPT的api代理实现、个人创新的帧评论播放器等功能，也包含注册登录等基础功能。
主要定位是作为个人视频创作者的工作流智能助手网站。

此目录是前端部分，对应后端部分的地址：
- [https://github.com/dlyqs/FrameWorld_Backend](https://github.com/dlyqs/FrameWorld_Backend)


## 声明
前端基于Nuxt3架构，vue开发使用vuetify，初始时的gpt代理对话功能模块参考开源项目：
- [https://github.com/WongSaang/chatgpt-ui](https://github.com/WongSaang/chatgpt-ui)
- [https://github.com/WongSaang/chatgpt-ui-server](https://github.com/WongSaang/chatgpt-ui-server)

但只保留了其唯一的接受发送的功能逻辑，删去了其它大部分功能，并进行了整理、优化、重构。除此之外所有功能代码均为自主编写（借助了ChatGPT）。

## 功能
（部分已实现、部分是设想）
- 用户系统，支持用户注册、登录、修改密码等。
- “主页”，支持新建通过api的ChatGPT对话，侧边栏可进行历史对话管理。
- “构思”，支持用户交互从而生成视频创作构思点子。
- “资源”，集成影视资源网址导航，实现了基于特定网站爬虫的搜索功能。
- “文案”，提供定制切换按钮和输入交互，通过爬虫和二次对话使针对视频文案的gpt建议回答相比于原生更优秀。
- “帧世界”，自主创新的帧评论播放器，支持用户选择进度条位置生成帧评论。

## 本地开发配置
- node.js版本：20.11.0

1、安装依赖
~~~
yarn install
~~~
环境配置常见解决方法：
换镜像源下载、管理node版本、手动下载依赖等等。

2、数据库和前后端通信
- 前端不需要管数据库，在前端.env文件中配置后端服务地址，也可以直接在frontend/server/middleware/apiProxy.ts 修改。
- 如果修改了后端地址端口还是没用，需要在本地环境变量中添加。

3、启动前端
~~~
yarn dev
~~~
后续遇到问题常见解决方案：
删除.Nuxt、node_modules后重新安装依赖，或者升级依赖。
~~~
yarn install
yarn cache clean
yarn upgrade
~~~

默认前端地址：http://localhost:3000
默认后端地址：http://localhost:8000/admin

