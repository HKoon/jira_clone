# Enhanced Jira Clone Features

本文档描述了为Jira克隆项目添加的增强功能。

## 🔐 认证系统

### 功能特性
- 用户注册和登录
- 密码加密存储（bcrypt）
- JWT令牌认证
- 安全的密码验证

### API端点
```
POST /authentication/register
POST /authentication/login
GET /currentUser
```

### 使用示例
```javascript
// 注册
const response = await api.post('/authentication/register', {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securepassword123'
});

// 登录
const response = await api.post('/authentication/login', {
  email: 'john@example.com',
  password: 'securepassword123'
});
```

## 👥 权限管理系统

### 角色类型
- **Administrator**: 完整系统访问权限
- **Project Manager**: 项目和团队管理权限
- **Developer**: 开发相关权限
- **Tester**: 测试相关权限
- **Viewer**: 只读权限

### 权限类别
- 项目权限（查看、编辑、删除）
- 问题权限（查看、创建、编辑、删除、分配）
- 用户权限（查看、编辑）
- 评论权限（查看、创建、编辑、删除）
- 管理权限（用户管理、角色管理）

### 中间件使用
```javascript
// 要求特定权限
app.get('/admin/users', requirePermission(Permission.ADMIN_USER_MANAGEMENT), users.getAll);

// 要求特定角色
app.delete('/projects/:id', requireRole('admin'), projects.delete);
```

## 🔔 通知系统

### 通知类型
- 问题分配通知
- 问题状态更新通知
- 评论提及通知
- 截止日期提醒
- 项目邀请通知

### API端点
```
GET /notifications
PUT /notifications/:id/read
PUT /notifications/mark-all-read
GET /notifications/unread-count
DELETE /notifications/:id
```

### 使用示例
```javascript
// 创建通知
await NotificationService.notifyIssueAssigned(issueId, assigneeId, assignerId);

// 获取用户通知
const notifications = await api.get('/notifications');
```

## ⏱️ 时间跟踪系统

### 功能特性
- 记录工作时间
- 按问题和用户统计
- 生成时间报告
- 工作日期跟踪

### API端点
```
POST /time-logs
GET /issues/:issueId/time-logs
GET /time-logs/user
PUT /time-logs/:id
DELETE /time-logs/:id
GET /time-logs/report
```

### 使用示例
```javascript
// 记录时间
await api.post('/time-logs', {
  issueId: 123,
  timeSpent: 120, // 分钟
  description: '实现用户认证功能',
  workDate: '2024-01-15'
});

// 获取时间报告
const report = await api.get('/time-logs/report?startDate=2024-01-01&endDate=2024-01-31');
```

## 🗄️ 数据库迁移

### 迁移文件
1. `1640000000000-AddPasswordToUser.ts` - 为用户表添加密码字段
2. `1640000000001-CreateRoleTable.ts` - 创建角色表
3. `1640000000002-CreateUserRoleTable.ts` - 创建用户-角色关联表
4. `1640000000003-CreateNotificationTable.ts` - 创建通知表
5. `1640000000004-CreateTimeLogTable.ts` - 创建时间日志表

### 迁移命令
```bash
# 运行迁移
npm run migration:run

# 回滚迁移
npm run migration:revert

# 生成新迁移
npm run migration:generate -- MigrationName
```

## 🌱 数据种子

### 默认角色
系统会自动创建以下默认角色：
- Administrator
- Project Manager
- Developer
- Tester
- Viewer

### 种子命令
```bash
npm run seed
```

## 🚀 安装和配置

### 1. 运行安装脚本
```bash
chmod +x setup-enhanced-features.sh
./setup-enhanced-features.sh
```

### 2. 环境变量配置
确保 `.env` 文件包含以下配置：
```
JWT_SECRET=your-secret-key-here
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=jira_development
```

### 3. 数据库设置
```bash
# 运行迁移
npm run migration:run

# 种子数据
npm run seed
```

## 🔧 开发指南

### 添加新权限
1. 在 `middleware/permissions.ts` 中添加新的权限枚举
2. 更新角色权限配置
3. 在路由中应用权限检查

### 添加新通知类型
1. 在 `entities/Notification.ts` 中添加新的通知类型
2. 在 `services/notificationService.ts` 中添加创建方法
3. 在相应的业务逻辑中调用通知服务

### 扩展时间跟踪
1. 修改 `entities/TimeLog.ts` 实体
2. 更新 `controllers/timeLogs.ts` 控制器
3. 创建相应的数据库迁移

## 📚 API文档

详细的API文档请参考各个控制器文件中的实现。所有端点都支持标准的HTTP状态码和错误响应格式。

## 🔒 安全注意事项

1. **密码安全**: 所有密码都使用bcrypt加密存储
2. **JWT安全**: 令牌包含过期时间，建议定期轮换密钥
3. **权限检查**: 所有敏感操作都需要适当的权限验证
4. **输入验证**: 所有用户输入都经过验证和清理
5. **SQL注入防护**: 使用TypeORM的参数化查询

## 🧪 测试

建议为新功能添加相应的测试：
- 单元测试：测试各个服务和工具函数
- 集成测试：测试API端点
- E2E测试：测试完整的用户流程

## 📈 性能优化

1. **数据库索引**: 已为常用查询字段添加索引
2. **查询优化**: 使用适当的关联查询减少N+1问题
3. **缓存策略**: 可考虑为频繁访问的数据添加缓存
4. **分页**: 大数据量查询支持分页

## 🔄 版本升级

在升级系统时，请按以下顺序操作：
1. 备份数据库
2. 运行新的迁移
3. 更新种子数据
4. 测试核心功能
5. 部署到生产环境