import { DataSource } from 'typeorm';
import { User } from 'entities/User';
import { Project } from 'entities/Project';
import { Issue } from 'entities/Issue';
import { Comment } from 'entities/Comment';
import { Notification } from 'entities/Notification';
import { TimeLog } from 'entities/TimeLog';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'jira_development',
  synchronize: process.env.NODE_ENV === 'development',
  entities: [User, Project, Issue, Comment, Notification, TimeLog],
  migrations: ['src/migrations/*.ts'],
  migrationsRun: process.env.NODE_ENV !== 'development',
});

export const createDatabaseConnection = (): Promise<DataSource> =>
  AppDataSource.initialize();
