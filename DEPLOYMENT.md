# 部署指南

## 502 错误修复说明

本次更新修复了 Docker 部署时出现的 502 Bad Gateway 错误。主要改进包括:

### 问题原因

1. **容器启动时重复编译和构建** - 每次启动都要重新安装依赖和构建前端，导致启动时间过长
2. **环境变量配置问题** - .env 文件未正确加载到 Docker 容器
3. **健康检查配置不当** - 容器在编译完成前就被标记为 unhealthy
4. **容器依赖关系混乱** - 容器之间的启动顺序和依赖关系不清晰

### 解决方案

1. **使用多阶段 Dockerfile** - 将构建和运行分离，减少容器大小和启动时间
2. **预编译 PHP 扩展** - 在镜像构建时完成扩展编译
3. **优化环境变量加载** - 自动检测和加载正确的 .env 文件
4. **简化 docker-compose 配置** - 移除运行时编译，使用预构建镜像

## 快速部署

### 方式一: 使用自动部署脚本（推荐）

```bash
./deploy.sh
```

该脚本会自动:
- 检查 Docker 环境
- 停止旧容器
- 构建新镜像
- 启动所有服务
- 验证服务状态
- 显示访问地址

### 方式二: 手动部署

```bash
# 1. 停止旧容器
docker-compose down

# 2. 构建镜像
docker-compose build --no-cache

# 3. 启动服务
docker-compose up -d

# 4. 查看状态
docker-compose ps

# 5. 查看日志
docker-compose logs -f
```

## 诊断工具

如果部署后仍然出现问题，运行诊断脚本:

```bash
./diagnose.sh
```

诊断脚本会检查:
- Docker 服务状态
- 容器运行状态
- 端口占用情况
- 容器日志
- API 连接测试
- 环境变量配置

## 访问地址

部署成功后，可以通过以下地址访问:

- **主页 (PHP)**: http://localhost:8000/
- **React 应用**: http://localhost:8000/index/
- **API 健康检查**: http://localhost:8000/index/health
- **股票 API**: http://localhost:8000/index/api/stock
- **AI 诊断 API**: http://localhost:8000/index/api/gemini

## 端口配置

默认端口映射:
- `8000` - Nginx (HTTP)
- `8001` - Nginx (HTTPS, 需要配置证书)
- `9000` - PHP-FPM (内部)
- `3001` - Node.js API (内部)

如需修改端口，编辑 `docker-compose.yml`:

```yaml
nginx:
  ports:
    - "8000:80"  # 修改 8000 为其他端口
```

## 环境变量配置

### 必需的环境变量

在 `index/.env.production` 中配置:

```env
# SiliconFlow AI 配置（必须）
SILICONFLOW_API_KEY=your_actual_api_key_here

# JWT 密钥（必须，生产环境使用强随机字符串）
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# CORS 配置（根据域名修改）
CORS_ORIGIN=https://ostosk.jp

# 其他配置
API_PORT=3001
NODE_ENV=production
TRUST_PROXY=true
```

### 重要提醒

1. **API Key**: 必须替换 `SILICONFLOW_API_KEY` 为实际的 API 密钥
2. **JWT Secret**: 生产环境必须使用强随机字符串
3. **CORS Origin**: 根据实际域名修改

## 常见问题

### 0. PHP 容器无法启动

**原因**: PHP-FPM 配置错误或扩展安装失败

**诊断步骤**:
```bash
# 运行 PHP 专用诊断脚本
./diagnose-php.sh

# 查看 PHP 容器日志
docker-compose logs php

# 测试 PHP-FPM 配置
docker-compose exec php php-fpm -t

# 检查 PHP 扩展
docker-compose exec php php -m

# 查看 PHP 错误日志
docker-compose exec php cat /var/log/php/error.log
```

**解决方案**:
```bash
# 方案1: 重新构建 PHP 容器
docker-compose down
docker-compose build --no-cache php
docker-compose up -d

# 方案2: 检查 php.ini 配置
# 确保所有路径和设置正确

# 方案3: 验证 Dockerfile.php
# 确保所有扩展正确安装
```

**常见错误及修复**:
- `curl extension not found` - curl 是 PHP 核心功能，无需安装扩展
- `log directory not found` - 已在 Dockerfile 中创建 /var/log/php
- `php-fpm configuration test failed` - 检查 www.conf 配置文件

### 1. 502 Bad Gateway

**原因**: Node.js 容器未就绪或未正常运行

**解决方案**:
```bash
# 查看 Node.js 容器日志
docker-compose logs nodejs

# 重启 Node.js 容器
docker-compose restart nodejs

# 如果问题持续，重新构建
docker-compose build --no-cache nodejs
docker-compose up -d
```

### 2. 容器启动失败

**原因**: 镜像构建失败或配置错误

**解决方案**:
```bash
# 查看容器日志
docker-compose logs

# 完全清理并重建
docker-compose down --rmi local
docker-compose build --no-cache
docker-compose up -d
```

### 3. 端口冲突

**原因**: 端口已被其他服务占用

**解决方案**:
```bash
# 检查端口占用
lsof -i :8000

# 方式1: 停止占用端口的服务
# 方式2: 修改 docker-compose.yml 中的端口映射
```

### 4. API Key 未配置

**现象**: 日志中显示 "SILICONFLOW_API_KEY is not configured"

**解决方案**:
1. 编辑 `index/.env.production`
2. 设置正确的 API Key
3. 重新构建镜像: `docker-compose build --no-cache nodejs`
4. 重启容器: `docker-compose up -d`

### 5. 数据库文件权限问题

**原因**: 容器内的用户权限不足

**解决方案**:
```bash
# 修复文件权限
sudo chown -R 1000:1000 index/server/data/

# 重启容器
docker-compose restart nodejs
```

## 管理命令

```bash
# 查看所有容器状态
docker-compose ps

# 查看实时日志
docker-compose logs -f

# 查看特定容器日志
docker-compose logs -f nginx
docker-compose logs -f php
docker-compose logs -f nodejs

# 重启服务
docker-compose restart

# 重启特定服务
docker-compose restart nodejs

# 停止服务
docker-compose down

# 停止并删除卷
docker-compose down -v

# 进入容器 shell
docker-compose exec nodejs sh
docker-compose exec php bash
docker-compose exec nginx sh
```

## 性能优化

### 1. 生产环境构建

确保使用生产模式构建:
```bash
NODE_ENV=production docker-compose build
```

### 2. 镜像大小优化

当前配置已使用多阶段构建，最小化镜像大小:
- Node.js: ~150MB (使用 Alpine Linux)
- PHP: ~400MB (预编译扩展)
- Nginx: ~25MB

### 3. 资源限制

如需限制容器资源，在 `docker-compose.yml` 添加:

```yaml
services:
  nodejs:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## 监控和日志

### 查看实时日志

```bash
# 所有服务
docker-compose logs -f

# 特定服务，最近 100 行
docker-compose logs --tail=100 nodejs
```

### 日志持久化

Nginx 日志已挂载到命名卷 `nginx_logs`，可以访问:

```bash
docker volume inspect stock-ai-service_nginx_logs
```

## 备份和恢复

### 数据库备份

数据库自动备份功能已启用，每 24 小时自动备份一次，备份文件位于:
```
index/server/data/backups/
```

### 手动备份

```bash
# 复制数据库文件
cp index/server/data/database.db backups/database-$(date +%Y%m%d).db

# 备份整个数据目录
tar -czf data-backup-$(date +%Y%m%d).tar.gz index/server/data/
```

### 恢复备份

```bash
# 停止服务
docker-compose down

# 恢复数据库
cp backups/database-YYYYMMDD.db index/server/data/database.db

# 启动服务
docker-compose up -d
```

## 安全建议

1. **使用 HTTPS**: 在生产环境配置 SSL 证书
2. **更改默认密钥**: 修改 JWT_SECRET 为强随机字符串
3. **限制 CORS**: 设置 CORS_ORIGIN 为特定域名
4. **定期更新**: 保持 Docker 镜像和依赖更新
5. **备份数据**: 定期备份数据库文件
6. **监控日志**: 定期检查错误日志

## 生产环境部署

### 使用反向代理

建议在生产环境使用 Cloudflare、Nginx 或 Apache 作为反向代理:

```nginx
# Nginx 反向代理配置示例
server {
    listen 80;
    server_name ostosk.jp;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### SSL 证书配置

使用 Let's Encrypt 免费 SSL 证书:

```bash
# 安装 certbot
sudo apt-get install certbot

# 获取证书
sudo certbot certonly --standalone -d ostosk.jp

# 证书路径
# /etc/letsencrypt/live/ostosk.jp/fullchain.pem
# /etc/letsencrypt/live/ostosk.jp/privkey.pem
```

## 更新日志

### v1.1.0 (当前版本)

- 修复 502 Bad Gateway 错误
- 优化 Docker 镜像构建
- 改进环境变量加载
- 添加自动部署脚本
- 添加诊断工具
- 优化容器启动时间

### v1.0.0

- 初始版本
- 基础 Docker 配置
- PHP + Node.js + Nginx 架构

## 技术支持

如果遇到问题:

1. 查看 [DEPLOYMENT.md](DEPLOYMENT.md) 文档
2. 运行 `./diagnose.sh` 诊断脚本
3. 查看容器日志: `docker-compose logs`
4. 检查环境变量配置
5. 确保 Docker 和 docker-compose 版本最新

## 系统要求

- Docker 20.10+
- docker-compose 1.29+
- 最少 2GB RAM
- 最少 5GB 磁盘空间
