#!/bin/bash

echo "========================================="
echo "Docker 容器诊断脚本"
echo "========================================="

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}[1] 检查 Docker 服务${NC}"
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Docker 已安装${NC}"
    docker --version
else
    echo -e "${RED}✗ Docker 未安装${NC}"
fi

echo ""
echo -e "${BLUE}[2] 检查容器状态${NC}"
docker-compose ps

echo ""
echo -e "${BLUE}[3] 检查容器健康状态${NC}"
docker inspect --format='{{.Name}}: {{.State.Health.Status}}' $(docker-compose ps -q) 2>/dev/null || echo "容器可能未运行或未配置健康检查"

echo ""
echo -e "${BLUE}[4] 检查端口占用${NC}"
echo "端口 8000 (Nginx):"
lsof -i :8000 2>/dev/null || netstat -tuln | grep :8000 || echo "端口未占用"
echo ""
echo "端口 9000 (PHP-FPM):"
docker-compose exec php netstat -tuln 2>/dev/null | grep :9000 || echo "无法检查（容器可能未运行）"
echo ""
echo "端口 3001 (Node.js):"
docker-compose exec nodejs netstat -tuln 2>/dev/null | grep :3001 || echo "无法检查（容器可能未运行）"

echo ""
echo -e "${BLUE}[5] 检查最近的错误日志${NC}"
echo ""
echo "=== PHP 容器日志 (最后 20 行) ==="
docker-compose logs --tail=20 php 2>/dev/null || echo "无法获取日志"

echo ""
echo "=== Node.js 容器日志 (最后 20 行) ==="
docker-compose logs --tail=20 nodejs 2>/dev/null || echo "无法获取日志"

echo ""
echo "=== Nginx 容器日志 (最后 20 行) ==="
docker-compose logs --tail=20 nginx 2>/dev/null || echo "无法获取日志"

echo ""
echo -e "${BLUE}[6] 测试 API 连接${NC}"
echo ""
echo "测试健康检查 API:"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/index/health 2>/dev/null)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ 健康检查 API 响应正常 (200)${NC}"
    curl -s http://localhost:8000/index/health | jq . 2>/dev/null || curl -s http://localhost:8000/index/health
elif [ "$HTTP_CODE" = "502" ]; then
    echo -e "${RED}✗ 502 Bad Gateway - 后端服务未就绪${NC}"
elif [ "$HTTP_CODE" = "000" ]; then
    echo -e "${RED}✗ 无法连接到服务器${NC}"
else
    echo -e "${YELLOW}⚠ HTTP 状态码: $HTTP_CODE${NC}"
fi

echo ""
echo -e "${BLUE}[7] 检查环境变量${NC}"
echo "Node.js 容器环境变量:"
docker-compose exec nodejs env | grep -E "NODE_ENV|API_PORT|SILICONFLOW" 2>/dev/null || echo "无法检查（容器可能未运行）"

echo ""
echo -e "${BLUE}[8] 检查文件权限${NC}"
echo "检查关键文件:"
ls -la /tmp/cc-agent/64881103/project/index/.env* 2>/dev/null || echo "环境文件不存在"

echo ""
echo "========================================="
echo -e "${GREEN}诊断完成${NC}"
echo "========================================="
echo ""
echo "常见问题解决方案:"
echo ""
echo "1. 如果看到 502 错误:"
echo "   - 检查 Node.js 容器是否正常运行"
echo "   - 查看 Node.js 容器日志: docker-compose logs nodejs"
echo "   - 确保 .env.production 文件存在且配置正确"
echo ""
echo "2. 如果容器启动失败:"
echo "   - 重新构建镜像: docker-compose build --no-cache"
echo "   - 清理并重启: docker-compose down && docker-compose up -d"
echo ""
echo "3. 如果端口被占用:"
echo "   - 修改 docker-compose.yml 中的端口映射"
echo "   - 或停止占用端口的其他服务"
echo ""
