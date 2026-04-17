

# Mc梦想天域服务器官网

一个基于 Bootstrap 构建的现代游戏服务器官方网站，提供服务器状态查询、团队展示、作品集、常见问题解答等功能。

## 功能特性

- **服务器状态实时显示** - 动态获取并展示游戏服务器在线状态、玩家数量等信息
- **响应式设计** - 完美适配桌面端、平板和移动设备
- **团队展示** - 展示服务器管理团队成员信息
- **作品集画廊** - 展示服务器内的建筑作品或截图
- **FAQ 问答** - 常见问题解答区域
- **联系方式** - 包含 QQ 群、Discord 等联系方式

## 文件结构

```
www.mcdtc.com/
├── 404.html                 # 自定义 404 错误页面
├── index.html               # 主页面
├── favicon.ico              # 网站图标
└── assets/
    ├── css/                 # 样式文件
    │   ├── bootstrap.min.css
    │   ├── custom-style.css
    │   ├── font-awesome.min.css
    │   ├── lightcase.css
    │   ├── responsive.css
    │   └── style.css
    ├── js/                  # JavaScript 文件
    │   ├── bootstrap.min.js
    │   ├── custom.js
    │   ├── jquery.easing.min.js
    │   ├── jquery.min.js
    │   ├── lightcase.js
    │   └── server-status.js
    ├── fonts/               # 字体文件
    ├── images/              # 图片资源
    └── mp3/                 # 背景音乐
```

## 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式设计
- **JavaScript (ES6+)** - 交互逻辑
- **jQuery** - DOM 操作和动画
- **Bootstrap 3** - 响应式框架
- **Font Awesome** - 图标库
- **Lightcase** - 画廊灯箱效果

## 快速开始

1. 克隆或下载此仓库
2. 使用本地服务器运行（如 VS Code 的 Live Server 插件）
3. 直接在浏览器中打开 `index.html`

```bash
# 使用 Python 启动简单服务器
python -m http.server 8000

# 或使用 Node.js
npx serve
```

## 自定义配置

### 修改服务器地址

在 `assets/js/server-status.js` 中修改 API 端点：

```javascript
const API_ENDPOINT = 'your-server-status-api.com';
```

### 修改联系信息

在 `index.html` 中找到 `#contact` 部分，修改对应的联系方式。

## 浏览器支持

- Chrome/Edge (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Opera (最新版本)

## 许可证

本项目仅供学习交流使用。