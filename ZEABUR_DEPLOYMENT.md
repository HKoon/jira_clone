# Zeabur 部署指南

本指南将帮助您将 Jira Clone 项目部署到 Zeabur 平台。

## 前置要求

- GitHub 账户
- Zeabur 账户
- 项目代码已推送到 GitHub 仓库

## 部署步骤

### 1. 项目准备

确保你的项目已经推送到 GitHub 仓库，并且包含以下文件：
- `zbpack.json` - Zeabur 根目录配置文件
- `api/zbpack.json` - API 服务的 Zeabur 配置
- `client/zbpack.json` - 前端服务的 Zeabur 配置
- `api/Dockerfile` - API 服务的 Docker 配置（可选）
- `client/Dockerfile` - 前端服务的 Docker 配置（可选）
- `.dockerignore` - Docker 忽略文件

### 2. 在 Zeabur 上创建项目

#### 方法一：使用 zbpack.json 配置文件（自动检测）

1. 在 [Zeabur Dashboard](https://dash.zeabur.com) 中点击 "New Project"
2. 选择 "Import from GitHub"
3. 选择你的 `jira_clone` 仓库
4. Zeabur 会自动检测项目结构和 `zbpack.json` 配置文件
5. 为每个服务（api 和 client）分别创建部署

#### 方法二：手动创建服务（推荐）

如果自动检测失败，可以手动创建服务：

1. **创建数据库服务**
   - 在项目中点击 "Add Service"
   - 选择 "Database" → "PostgreSQL"
   - 选择版本 14 或更高
   - 记录数据库连接信息

2. **创建 API 服务**
   - 点击 "Add Service" → "Git Repository"
   - 选择你的仓库
   - 设置以下配置：
     - **Source Directory**: `/api`
     - **Framework**: Node.js（自动检测）
     - Zeabur 会自动读取 `api/zbpack.json` 配置
     - **Port**: `5000`

3. **创建前端服务**
   - 点击 "Add Service" → "Git Repository"
   - 选择你的仓库
   - 设置以下配置：
     - **Source Directory**: `/client`
     - **Framework**: Node.js（自动检测）
     - Zeabur 会自动读取 `client/zbpack.json` 配置
     - **Port**: `3000`

### 3. 配置服务

#### 数据库服务 (PostgreSQL)
- 在 Zeabur 中添加 PostgreSQL 服务
- 版本：14 或更高

#### API 服务配置
- **源码路径**: `/api`
- **构建命令**: `npm install && npm run build`
- **启动命令**: `npm start`
- **端口**: 5000

#### 前端服务配置
- **源码路径**: `/client`
- **构建命令**: `npm install && npm run build`
- **启动命令**: `npm run serve`
- **端口**: 3000

### 4. 配置环境变量

在 Zeabur Dashboard 中为每个服务配置环境变量：

#### API 服务环境变量
```
NODE_ENV=production
DB_HOST=${DATABASE_HOST}
DB_PORT=${DATABASE_PORT}
DB_USERNAME=${DATABASE_USERNAME}
DB_PASSWORD=${DATABASE_PASSWORD}
DB_DATABASE=${DATABASE_NAME}
JWT_SECRET=your-jwt-secret-key
```

#### 前端服务环境变量
```
NODE_ENV=production
REACT_APP_API_URL=${API_SERVICE_URL}/api
```

### 5. 部署

1. 确认所有配置正确
2. 点击 "Deploy" 开始部署
3. 等待构建和部署完成

### 6. 初始化数据库

部署完成后，需要初始化数据库：

1. 在 API 服务的终端中运行：
```bash
npm run migration:run
npm run seed
```

### 7. 访问应用

部署完成后，您可以通过 Zeabur 提供的 URL 访问您的应用。

## 自动部署

配置完成后，每次向 GitHub 仓库推送代码时，Zeabur 会自动重新部署您的应用。

## 故障排除

### 常见问题

1. **构建失败**
   - 检查 `package.json` 中的脚本是否正确
   - 确认所有依赖都已正确安装

2. **数据库连接失败**
   - 检查环境变量是否正确配置
   - 确认数据库服务已启动

3. **API 无法访问**
   - 检查端口配置是否正确
   - 确认健康检查路径存在

### 日志查看

在 Zeabur Dashboard 中，您可以查看每个服务的实时日志来诊断问题。

## 扩展配置

### 自定义域名

在 Zeabur Dashboard 中，您可以为您的应用配置自定义域名。

### 环境分离

您可以创建多个项目来分离开发、测试和生产环境。

### 监控和告警

Zeabur 提供内置的监控和告警功能，帮助您监控应用的健康状态。

## 支持

如果您在部署过程中遇到问题，可以：
- 查看 [Zeabur 官方文档](https://docs.zeabur.com)
- 联系 Zeabur 技术支持
- 在项目 GitHub 仓库中提交 Issue