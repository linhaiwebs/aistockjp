#!/bin/bash

set -e

echo "========================================="
echo "股票 AI 诊断系统部署脚本"
echo "========================================="

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo -e "${RED}错误: Docker 未安装，请先安装 Docker${NC}"
    exit 1
fi

# 检查 docker-compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}错误: docker-compose 未安装，请先安装 docker-compose${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker 和 docker-compose 已安装${NC}"

# 停止并移除旧容器
echo ""
echo "正在停止旧容器..."
docker-compose down --remove-orphans || true

# 清理旧镜像（可选）
read -p "是否清理旧的 Docker 镜像？(y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "正在清理旧镜像..."
    docker-compose down --rmi local || true
    docker system prune -f
fi

# 构建 Docker 镜像
echo ""
echo "正在构建 Docker 镜像..."
docker-compose build --no-cache

# 检查构建是否成功
if [ $? -ne 0 ]; then
    echo -e "${RED}错误: Docker 镜像构建失败${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker 镜像构建成功${NC}"

# 启动容器
echo ""
echo "正在启动容器..."
docker-compose up -d

# 等待容器启动
echo ""
echo "等待容器启动..."
sleep 10

# 检查容器状态
echo ""
echo "检查容器状态..."
docker-compose ps

# 检查 PHP 容器
if ! docker-compose ps | grep -q "stock-ai-php.*Up"; then
    echo -e "${RED}错误: PHP 容器未正常运行${NC}"
    echo "PHP 容器日志:"
    docker-compose logs --tail=50 php
    exit 1
fi

echo -e "${GREEN}✓ PHP 容器运行正常${NC}"

# 检查 Node.js 容器
if ! docker-compose ps | grep -q "stock-ai-nodejs.*Up"; then
    echo -e "${RED}错误: Node.js 容器未正常运行${NC}"
    echo "Node.js 容器日志:"
    docker-compose logs --tail=50 nodejs
    exit 1
fi

echo -e "${GREEN}✓ Node.js 容器运行正常${NC}"

# 检查 Nginx 容器
if ! docker-compose ps | grep -q "stock-ai-nginx.*Up"; then
    echo -e "${RED}错误: Nginx 容器未正常运行${NC}"
    echo "Nginx 容器日志:"
    docker-compose logs --tail=50 nginx
    exit 1
fi

echo -e "${GREEN}✓ Nginx 容器运行正常${NC}"

# 等待服务就绪
echo ""
echo "等待服务就绪..."
sleep 5

# 测试 API 健康检查
echo ""
echo "测试 API 健康检查..."
for i in {1..30}; do
    if curl -f http://localhost:8000/index/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ API 健康检查通过${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${YELLOW}警告: API 健康检查超时，但容器仍在运行${NC}"
        echo "Node.js 容器日志:"
        docker-compose logs --tail=50 nodejs
    fi
    sleep 2
done

# 显示访问信息
echo ""
echo "========================================="
echo -e "${GREEN}部署成功！${NC}"
echo "========================================="
echo ""
echo "访问地址:"
echo "  - 主页 (PHP):           http://localhost:8000/"
echo "  - React 应用:          http://localhost:8000/index/"
echo "  - API 健康检查:        http://localhost:8000/index/health"
echo "  - 股票 API:            http://localhost:8000/index/api/stock"
echo "  - AI 诊断 API:         http://localhost:8000/index/api/gemini"
echo ""
echo "管理命令:"
echo "  查看日志:             docker-compose logs -f"
echo "  查看特定容器日志:     docker-compose logs -f [nginx|php|nodejs]"
echo "  停止服务:             docker-compose down"
echo "  重启服务:             docker-compose restart"
echo "  查看容器状态:         docker-compose ps"
echo ""
echo "========================================="
