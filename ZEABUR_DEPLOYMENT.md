# Zeabur 部署指南

本指南将帮助您将 Jira Clone 项目部署到 Zeabur 平台。

## 前置要求

- GitHub 账户
- Zeabur 账户
- 项目代码已推送到 GitHub 仓库

## 部署步骤

### 1. 项目准备

确保你的项目已经推送到 GitHub 仓库，并且包含以下文件：
- `zbpack.json` - API 服务的 Zeabur 配置（默认服务）
- `zbpack.client.json` - 前端服务的 Zeabur 配置
- `api/zbpack.json` - API 服务目录内的配置（可选）
- `client/zbpack.json` - 前端服务目录内的配置（可选）
- `api/Dockerfile` - API 服务的 Docker 配置（可选）
- `client/Dockerfile` - 前端服务的 Docker 配置（可选）
- `.dockerignore` - Docker 忽略文件

### 2. 在 Zeabur 上创建项目

#### 正确的多服务部署方法

对于包含多个服务的单一仓库（Monorepo），需要为每个服务手动创建独立的部署：

1. 在 [Zeabur Dashboard](https://dash.zeabur.com) 中点击 "New Project"

2. **创建数据库服务**：
   - 点击 "Add Service" 或 "Deploy service"
   - 选择 "Database" → "PostgreSQL"
   - 选择版本 14 或更高
   - 记录数据库连接信息

3. **部署 API 服务**：
   - 点击 "Add Service" 或 "Deploy service"
   - 选择 "Deploy your source code"
   - 选择你的 `jira_clone` 仓库
   - 服务名称设置为 `api`
   - Zeabur 会自动读取根目录的 `zbpack.json` 配置

4. **部署前端服务**：
   - 再次点击 "Add Service" 或 "Deploy service"
   - 选择 "Deploy your source code"
   - 选择相同的 `jira_clone` 仓库
   - 服务名称设置为 `client`
   - Zeabur 会自动读取 `zbpack.client.json` 配置

#### 备用方法：手动配置服务目录

如果配置文件方法不起作用，可以通过环境变量手动指定：

1. **API 服务**：
   - 部署时选择同一个仓库
   - 在环境变量中添加：`ZBPACK_APP_DIR=./api`
   - 或者添加：`ZBPACK_BUILD_COMMAND=cd api && npm install && npm run build`
   - 添加：`ZBPACK_START_COMMAND=cd api && npm start`

2. **前端服务**：
   - 部署时选择同一个仓库
   - 在环境变量中添加：`ZBPACK_APP_DIR=./client`
   - 或者添加：`ZBPACK_BUILD_COMMAND=cd client && npm install && npm run build`
   - 添加：`ZBPACK_START_COMMAND=cd client && npm run serve`

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

## 重要说明

**关于 Zeabur 多服务部署的关键要点：** <mcreference link="https://zeabur.com/docs/en-US/guides/nodejs" index="3">3</mcreference>

1. **Zeabur 不会自动为单个仓库创建多个服务** - 这是与其他平台的主要区别
2. **每个服务都需要手动创建** - 即使是同一个 GitHub 仓库，也需要分别部署
3. **使用配置文件区分服务** - 通过 `zbpack.json` 和 `zbpack.client.json` 来指定不同服务的配置 <mcreference link="https://zeabur.com/docs/en-US/guides/nodejs" index="3">3</mcreference>
4. **环境变量作为备用方案** - 如果配置文件不起作用，可以使用 `ZBPACK_APP_DIR` 等环境变量 <mcreference link="https://zeabur.com/docs/en-US/guides/nodejs" index="3">3</mcreference>

### 部署步骤总结

为了确保成功部署，请按照以下顺序操作：

1. **第一步**：创建新项目
2. **第二步**：添加 PostgreSQL 数据库服务
3. **第三步**：点击 "Add Service" → "Deploy your source code" → 选择仓库 → 服务名设为 `api`
4. **第四步**：再次点击 "Add Service" → "Deploy your source code" → 选择同一仓库 → 服务名设为 `client`
5. **第五步**：配置环境变量
6. **第六步**：等待部署完成并初始化数据库

## 故障排除

### 常见问题

1. **如何在 Zeabur 中部署多个服务**
   - Zeabur 不会自动识别并创建多个服务，需要手动为每个服务创建独立的部署
   - 对于同一个仓库，需要多次点击 "Add Service" 或 "Deploy service"
   - 每次都选择 "Deploy your source code" 并选择同一个仓库
   - 通过不同的服务名称（如 `api` 和 `client`）来区分服务
   - 使用 `zbpack.json` 和 `zbpack.client.json` 配置文件来指定不同的构建和启动命令
   - 如果配置文件不起作用，使用环境变量 `ZBPACK_APP_DIR` 来指定服务目录

2. **构建失败**
   - 检查 `package.json` 中的脚本是否正确
   - 确认所有依赖都已正确安装
   - 如果遇到npm依赖冲突错误（如typeorm相关），确保使用 `--legacy-peer-deps` 选项
   - 检查 `.npmrc` 文件是否包含 `legacy-peer-deps=true`
   - 如果遇到ts-node版本冲突（typeorm需要ts-node@^10.7.0），将devDependencies中的ts-node版本更新为 `^10.7.0`

3. **数据库连接失败**
   - 检查环境变量是否正确配置
   - 确认数据库服务已启动

4. **API 无法访问**
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