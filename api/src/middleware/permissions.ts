import { Request, Response, NextFunction } from 'express';
import { User, Role } from 'entities';
import { ForbiddenError } from 'errors';

export enum Permission {
  // Project permissions
  PROJECT_VIEW = 'project:view',
  PROJECT_EDIT = 'project:edit',
  PROJECT_DELETE = 'project:delete',
  
  // Issue permissions
  ISSUE_VIEW = 'issue:view',
  ISSUE_CREATE = 'issue:create',
  ISSUE_EDIT = 'issue:edit',
  ISSUE_DELETE = 'issue:delete',
  ISSUE_ASSIGN = 'issue:assign',
  
  // User permissions
  USER_VIEW = 'user:view',
  USER_EDIT = 'user:edit',
  USER_DELETE = 'user:delete',
  
  // Comment permissions
  COMMENT_VIEW = 'comment:view',
  COMMENT_CREATE = 'comment:create',
  COMMENT_EDIT = 'comment:edit',
  COMMENT_DELETE = 'comment:delete',
  
  // Admin permissions
  ADMIN_PANEL = 'admin:panel',
  ROLE_MANAGE = 'role:manage',
}

const rolePermissions = {
  admin: Object.values(Permission),
  project_manager: [
    Permission.PROJECT_VIEW,
    Permission.PROJECT_EDIT,
    Permission.ISSUE_VIEW,
    Permission.ISSUE_CREATE,
    Permission.ISSUE_EDIT,
    Permission.ISSUE_DELETE,
    Permission.ISSUE_ASSIGN,
    Permission.USER_VIEW,
    Permission.COMMENT_VIEW,
    Permission.COMMENT_CREATE,
    Permission.COMMENT_EDIT,
    Permission.COMMENT_DELETE,
  ],
  developer: [
    Permission.PROJECT_VIEW,
    Permission.ISSUE_VIEW,
    Permission.ISSUE_CREATE,
    Permission.ISSUE_EDIT,
    Permission.ISSUE_ASSIGN,
    Permission.USER_VIEW,
    Permission.COMMENT_VIEW,
    Permission.COMMENT_CREATE,
    Permission.COMMENT_EDIT,
  ],
  tester: [
    Permission.PROJECT_VIEW,
    Permission.ISSUE_VIEW,
    Permission.ISSUE_CREATE,
    Permission.ISSUE_EDIT,
    Permission.USER_VIEW,
    Permission.COMMENT_VIEW,
    Permission.COMMENT_CREATE,
  ],
  viewer: [
    Permission.PROJECT_VIEW,
    Permission.ISSUE_VIEW,
    Permission.USER_VIEW,
    Permission.COMMENT_VIEW,
  ],
};

export const requirePermission = (permission: Permission) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findOne({
        where: { id: req.currentUser.id },
        relations: ['roles'],
      });

      if (!user) {
        throw new ForbiddenError('User not found');
      }

      const hasPermission = user.roles.some(role => {
        const permissions = role.permissions || rolePermissions[role.type] || [];
        return permissions.includes(permission);
      });

      if (!hasPermission) {
        throw new ForbiddenError('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireRole = (roleType: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findOne({
        where: { id: req.currentUser.id },
        relations: ['roles'],
      });

      if (!user) {
        throw new ForbiddenError('User not found');
      }

      const hasRole = user.roles.some(role => role.type === roleType);

      if (!hasRole) {
        throw new ForbiddenError(`Role '${roleType}' required`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};