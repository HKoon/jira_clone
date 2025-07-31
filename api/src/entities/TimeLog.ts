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

@Entity()
class TimeLog extends BaseEntity {
  static validations = {
    timeSpent: [is.required(), is.min(1)],
    description: [is.maxLength(500)],
  };

  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  timeSpent: number; // in minutes

  @Column('text', { nullable: true })
  description: string | null;

  @Column('date')
  workDate: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(
    () => User,
    user => user.timeLogs,
  )
  user: User;

  @Column('integer')
  userId: number;

  @ManyToOne(
    () => Issue,
    issue => issue.timeLogs,
    { onDelete: 'CASCADE' }
  )
  issue: Issue;

  @Column('integer')
  issueId: number;
}

export default TimeLog;