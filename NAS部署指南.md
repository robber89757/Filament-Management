# NAS Docker 部署指南

## 前提条件
- NAS 已安装 Docker 套件（如群晖、威联通、绿联等）
- 能够通过 SSH 或 Web Terminal 访问 NAS

---

## 方法一：使用 docker-compose（推荐）

### 1. 上传文件到 NAS
通过 SFTP 或 NAS 文件管理器上传整个项目文件夹到 NAS，例如：
```
/volume1/docker/filament-management/
```

### 2. SSH 登录 NAS
使用 PuTTY（Windows）或终端（Mac/Linux）登录 NAS：
```bash
ssh admin@你的NAS地址
```

### 3. 进入项目目录
```bash
cd /volume1/docker/filament-management
```

### 4. 启动容器
```bash
docker-compose up -d
```

### 5. 访问网站
打开浏览器访问：`http://你的NAS地址:3001`

---

## 方法二：使用 Docker 命令

### 1. SSH 登录 NAS

### 2. 创建数据目录
```bash
mkdir -p /volume1/docker/filament-data
```

### 3. 运行容器
```bash
docker run -d \
  --name filament-management \
  --restart unless-stopped \
  -p 3001:3001 \
  -v /volume1/docker/filament-data:/app/data \
  -e PORT=3001 \
  your-dockerhub-username/filament-management:latest
```

---

## 方法三：群晖 DSM 图形界面部署

### 1. 打开 Container Manager
在 DSM 桌面打开"Container Manager"

### 2. 创建项目
- 选择"项目" → "创建"
- 项目名称：`filament-management`
- 配置来源：选择上传 `docker-compose.yml` 文件

### 3. 上传配置
将 `docker-compose.yml` 上传到 NAS 的共享文件夹

### 4. 启动
- 点击"创建项目"后选择上传的 `docker-compose.yml`
- 点击"下一步" → "完成"

---

## 方法四：威联通 QNAP Container Station

### 1. 打开 Container Station

### 2. 创建容器
- 点击"创建" → "从 Dockerfile 创建"
- 上传 `Dockerfile`

### 3. 端口映射
设置主机端口 `3001` 映射到容器端口 `3001`

### 4. 挂载卷
将 NAS 文件夹映射到容器内的 `/app/data`

---

## 常用命令

### 查看容器状态
```bash
docker ps
```

### 查看日志
```bash
docker logs -f filament-management
```

### 停止容器
```bash
docker-compose down
```

### 重启容器
```bash
docker-compose restart
```

### 更新镜像
```bash
docker-compose pull
docker-compose up -d
```

---

## 注意事项

1. **端口冲突**：确保 NAS 上 3001 端口未被占用
2. **防火墙**：在 NAS 防火墙中开放 3001 端口
3. **外网访问**：如需外网访问，需在路由器设置端口转发，或使用 DDNS

---

## 外网访问设置（可选）

### 方案一：反向代理（推荐）
在 NAS 上配置 Nginx 反向代理，通过域名访问：
```
你的域名.com -> localhost:3001
```

### 方案二：端口转发
在路由器设置：
- 外部端口：3001
- 内部 IP：你的 NAS IP
- 内部端口：3001
- 协议：TCP

### 方案三：内网穿透
使用 frp、ngrok 等工具穿透内网

---

## 数据备份

数据存储在 NAS 的 `/volume1/docker/filament-data` 目录：
- `spool.db` - 耗材数据
- `suppliers.db` - 供应商数据
- `expenseRecords.db` - 费用记录
- `salesRecords.db` - 销售记录

定期备份整个 `data` 文件夹即可。
