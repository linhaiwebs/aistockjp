# Loading 模式配置指南 (简体中文)

## 什么是 Loading 模式?

Loading 模式意味着 `index.php` 直接加载并输出 HTML 内容,而不是重定向用户。这样可以保持浏览器地址栏始终显示为 `/`,无论显示哪个页面。

## 核心优势

1. **完美的 URL 伪装**: 用户无法从地址栏判断页面切换
2. **快速加载**: 内容从本地文件提供,无需外部请求
3. **SEO 友好**: 搜索引擎看到的是静态 HTML
4. **双重访问**: 仍可通过 `/index/` 直接访问应用
5. **API 统一**: 两种模式使用相同的 API 端点

## Cloaking.House 配置

登录 Cloaking.House 控制台并配置:

```
Flow Label: 2af62ff72f49e8e7b16d938da7a2f3a4

Offer Page (真实流量页面):
  URL: index-loading.html
  Mode: loading ⚠️ 重要!

White Page (机器人/审核流量页面):
  URL: home/index.html
  Mode: loading ⚠️ 重要!
```

**重要**: 必须使用 "loading" 模式,不要使用 "redirect" 模式!

## 构建命令

### 构建 Loading 模式

```bash
cd index
npm install              # 首次运行或依赖更新时
npm run build:loading    # 构建 loading 模式
```

### 构建两种模式

```bash
cd index
npm run build:all        # 同时构建标准版和 loading 版
```

## 部署步骤

### 1. 构建所有资源

```bash
cd /path/to/project/index
npm install
npm run build:all
```

### 2. 测试配置

```bash
cd /path/to/project
./test-loading-mode.sh
```

预期结果: 所有检查通过 ✓

### 3. 使用 Docker 部署

```bash
cd /path/to/project
docker-compose down
docker-compose up -d --build
```

### 4. 验证部署

检查所有服务是否运行:

```bash
docker-compose ps
```

预期输出:
```
stock-ai-nginx    running   0.0.0.0:80->80/tcp
stock-ai-php      running   9000/tcp
stock-ai-nodejs   running   3001/tcp
```

## 测试访问

### 1. 根路径测试 (Cloaking 模式)

访问: `http://iswstock.com/`

预期行为:
- URL 保持为 `/`
- 内容由 Cloaking.House 决定
- 真实用户看到 Offer 页面
- 机器人看到 White 页面

### 2. 直接访问测试

访问: `http://iswstock.com/index/`

预期行为:
- URL 变为 `/index/`
- React 应用正常加载
- 绕过 cloaking

### 3. 管理后台测试

访问: `http://iswstock.com/index/adsadmin`

预期行为:
- 管理员登录页面
- 绕过 cloaking
- 直接访问 Node.js

### 4. API 测试

```bash
curl http://iswstock.com/index/api/stock?code=7203
```

预期: 返回股票数据的 JSON 响应

## 工作原理

### 用户访问根路径流程

```
用户访问 http://iswstock.com/
    ↓
Nginx 路由到 PHP
    ↓
index.php 执行
    ↓
调用 Cloaking.House API
    ↓
根据返回结果决定
    ↓
┌────────────┴────────────┐
│                         │
Offer 页面              White 页面
(真实用户)              (机器人/审核)
    ↓                       ↓
加载:                    加载:
index-loading.html      home/index.html
    ↓                       ↓
用户看到                用户看到
React 应用              静态页面
(URL 保持: /)           (URL 保持: /)
```

## 文件结构

```
project/
├── index.php                    # PHP cloaking 入口
├── index-loading.html           # 生成的 Offer 页面
├── home/
│   └── index.html              # White 页面 (静态)
├── nginx.conf                   # Nginx 配置
├── index/
│   ├── vite.config.ts          # 标准构建配置
│   ├── vite.config.loading.ts  # Loading 模式配置
│   ├── dist/                   # 标准构建输出
│   └── dist-loading/           # Loading 模式输出
└── 文档文件 (*.md)
```

## 两种访问模式对比

| 功能 | Loading 模式 (`/`) | 直接访问 (`/index/`) |
|------|-------------------|---------------------|
| 显示的 URL | `/` | `/index/...` |
| Cloaking 激活 | ✓ 是 | ✗ 否 |
| 入口点 | PHP | Node.js |
| 路由 basename | `/` | `/index` |
| 静态资源来源 | `dist-loading/` | `dist/` |
| 使用场景 | 生产环境 | 开发/备用 |

## 常见问题

### 资源加载 404 错误

**症状**: CSS/JS 文件返回 404

**解决方案**:
```bash
cd index
npm run build:loading
```

检查 nginx.conf 是否配置了 `/assets/` location。

### API 调用失败

**症状**: API 返回 404

**解决方案**:
- 验证 API 客户端使用 `/index/api/*` 路径
- 检查 nginx 中的 `/index/api/` 代理配置
- 确保 Node.js 服务器正在运行

### Cloaking 不工作

**症状**: 总是显示同一个页面

**解决方案**:
- 验证 Cloaking.House 配置
- 检查 flow label 是否匹配
- 使用不同的 user agent 测试

## 重要提示

### 应该做的

✓ 在 Cloaking.House 中使用 "loading" 模式
✓ 部署前构建两个版本
✓ 部署后测试所有访问模式
✓ 监控日志查看错误
✓ 保留 `dist/` 和 `dist-loading/` 两个目录

### 不应该做的

✗ 不要在 Cloaking.House 中使用 "redirect" 模式
✗ 不要删除 `dist-loading/` 目录
✗ 不要手动修改 `index-loading.html`
✗ 不要公开暴露管理路径 (`/adsadmin`)
✗ 不要跳过部署后的测试

## 快速参考

### 构建命令

```bash
# 仅构建 loading 模式
npm run build:loading

# 仅构建标准模式
npm run build

# 构建两种模式
npm run build:all
```

### 部署命令

```bash
# 启动服务
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 测试命令

```bash
# 运行测试脚本
./test-loading-mode.sh
```

## 访问 URL

```
根路径 (Cloaking):  http://iswstock.com/
直接访问:          http://iswstock.com/index/
管理后台:          http://iswstock.com/index/adsadmin
API 端点:          http://iswstock.com/index/api/*
```

## 部署检查清单

- [ ] 运行 `npm run build:all`
- [ ] 运行 `./test-loading-mode.sh`
- [ ] 配置 Cloaking.House (loading 模式)
- [ ] 部署: `docker-compose up -d --build`
- [ ] 测试根路径: `/`
- [ ] 测试直接访问: `/index/`
- [ ] 测试管理后台: `/index/adsadmin`
- [ ] 测试 API: `curl /index/api/stock?code=7203`
- [ ] 查看日志: `docker-compose logs -f`

## 支持资源

- **完整指南**: `LOADING_MODE_GUIDE.md` (英文)
- **快速参考**: `QUICK_REFERENCE.md` (英文)
- **架构图**: `LOADING_MODE_ARCHITECTURE.md` (英文)
- **总结**: `LOADING_MODE_SUMMARY.md` (英文)
- **测试脚本**: `./test-loading-mode.sh`

## 总结

Loading 模式配置已完成!主要特点:

1. **双构建系统**: 支持两种访问模式
2. **URL 伪装**: 根路径访问时 URL 保持不变
3. **灵活访问**: 仍可通过 `/index/` 直接访问
4. **统一 API**: 两种模式共享相同的后端 API
5. **易于部署**: 使用 Docker Compose 一键部署

现在可以部署并开始使用了!
