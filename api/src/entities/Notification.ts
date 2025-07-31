import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import is from 'utils/validation';
import { User, Issue } from '.';

export enum NotificationType {
  ISSUE_ASSIGNED = 'issue_assigned',
  ISSUE_UPDATED = 'issue_updated',
  ISSUE_COMMENTED = 'issue_commented',
  ISSUE_STATUS_CHANGED = 'issue_status_changed',
  PROJECT_UPDATED = 'project_updated',
  MENTION = 'mention',
}

@Entity()
class Notification extends BaseEntity {
  static validations = {
    type: [is.required(), is.oneOf(Object.values(NotificationType))],
    title: [is.required(), is.maxLength(200)],
    message: [is.required(), is.maxLength(1000)],
  };

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  type: NotificationType;

  @Column('varchar')
  title: string;

  @Column('text')
  message: string;

  @Column('boolean', { default: false })
  isRead: boolean;

  @Column('json', { nullable: true })
  metadata: any;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(
    () => User,
    user => user.notifications,
  )
  user: User;

  @Column('integer')
  userId: number;

  @ManyToOne(
    () => Issue,
    { nullable: true, onDelete: 'CASCADE' }
  )
  issue: Issue | null;

  @Column('integer', { nullable: true })
  issueId: number | null;

  @ManyToOne(
    () => User,
    { nullable: true }
  )
  triggeredBy: User | null;

  @Column('integer', { nullable: true })
  triggeredById: number | null;
}

export default Notification;