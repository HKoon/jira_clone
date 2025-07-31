import { Role, RoleType } from 'entities/Role';
import { Permission } from 'middleware/permissions';

const defaultRoles = [
  {
    name: 'Administrator',
    type: RoleType.ADMIN,
    description: 'Full system access with all permissions',
    permissions: Object.values(Permission),
  },
  {
    name: 'Project Manager',
    type: RoleType.PROJECT_MANAGER,
    description: 'Manage projects, issues, and team members',
    permissions: [
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
  },
  {
    name: 'Developer',
    type: RoleType.DEVELOPER,
    description: 'Create and manage issues, add comments',
    permissions: [
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
  },
  {
    name: 'Tester',
    type: RoleType.TESTER,
    description: 'Create and update issues, add comments',
    permissions: [
      Permission.PROJECT_VIEW,
      Permission.ISSUE_VIEW,
      Permission.ISSUE_CREATE,
      Permission.ISSUE_EDIT,
      Permission.USER_VIEW,
      Permission.COMMENT_VIEW,
      Permission.COMMENT_CREATE,
    ],
  },
  {
    name: 'Viewer',
    type: RoleType.VIEWER,
    description: 'Read-only access to projects and issues',
    permissions: [
      Permission.PROJECT_VIEW,
      Permission.ISSUE_VIEW,
      Permission.USER_VIEW,
      Permission.COMMENT_VIEW,
    ],
  },
];

export const seedRoles = async (): Promise<void> => {
  console.log('Seeding roles...');
  
  for (const roleData of defaultRoles) {
    const existingRole = await Role.findOne({ where: { type: roleData.type } });
    
    if (!existingRole) {
      const role = Role.create(roleData);
      await role.save();
      console.log(`Created role: ${roleData.name}`);
    } else {
      console.log(`Role already exists: ${roleData.name}`);
    }
  }
  
  console.log('Roles seeding completed.');
};