import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';

import is from 'utils/validation';
import { User } from '.';

export enum RoleType {
  ADMIN = 'admin',
  PROJECT_MANAGER = 'project_manager',
  DEVELOPER = 'developer',
  TESTER = 'tester',
  VIEWER = 'viewer',
}

@Entity()
class Role extends BaseEntity {
  static validations = {
    name: [is.required(), is.maxLength(50)],
    type: [is.required(), is.oneOf(Object.values(RoleType))],
  };

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  type: RoleType;

  @Column('text', { nullable: true })
  description: string | null;

  @Column('json', { nullable: true })
  permissions: string[] | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToMany(
    () => User,
    user => user.roles,
  )
  users: User[];
}

export default Role;