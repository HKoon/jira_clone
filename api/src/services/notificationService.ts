import { Notification, NotificationType, User, Issue } from 'entities';
import { createEntity } from 'utils/typeorm';

interface CreateNotificationData {
  type: NotificationType;
  title: string;
  message: string;
  userId: number;
  issueId?: number;
  triggeredById?: number;
  metadata?: any;
}

export class NotificationService {
  static async createNotification(data: CreateNotificationData): Promise<Notification> {
    return createEntity(Notification, data);
  }

  static async notifyIssueAssigned(issue: Issue, assignedUser: User, triggeredBy: User): Promise<void> {
    await this.createNotification({
      type: NotificationType.ISSUE_ASSIGNED,
      title: 'Issue Assigned',
      message: `You have been assigned to issue: ${issue.title}`,
      userId: assignedUser.id,
      issueId: issue.id,
      triggeredById: triggeredBy.id,
      metadata: {
        issueKey: `TASK-${issue.id}`,
        issueType: issue.type,
        issuePriority: issue.priority,
      },
    });
  }

  static async notifyIssueUpdated(issue: Issue, watchers: User[], triggeredBy: User): Promise<void> {
    const notifications = watchers
      .filter(user => user.id !== triggeredBy.id)
      .map(user => ({
        type: NotificationType.ISSUE_UPDATED,
        title: 'Issue Updated',
        message: `Issue "${issue.title}" has been updated`,
        userId: user.id,
        issueId: issue.id,
        triggeredById: triggeredBy.id,
        metadata: {
          issueKey: `TASK-${issue.id}`,
          issueType: issue.type,
          issuePriority: issue.priority,
        },
      }));

    for (const notificationData of notifications) {
      await this.createNotification(notificationData);
    }
  }

  static async notifyIssueCommented(issue: Issue, watchers: User[], triggeredBy: User): Promise<void> {
    const notifications = watchers
      .filter(user => user.id !== triggeredBy.id)
      .map(user => ({
        type: NotificationType.ISSUE_COMMENTED,
        title: 'New Comment',
        message: `${triggeredBy.name} commented on issue: ${issue.title}`,
        userId: user.id,
        issueId: issue.id,
        triggeredById: triggeredBy.id,
        metadata: {
          issueKey: `TASK-${issue.id}`,
          commenterName: triggeredBy.name,
        },
      }));

    for (const notificationData of notifications) {
      await this.createNotification(notificationData);
    }
  }

  static async notifyStatusChanged(
    issue: Issue,
    oldStatus: string,
    newStatus: string,
    watchers: User[],
    triggeredBy: User
  ): Promise<void> {
    const notifications = watchers
      .filter(user => user.id !== triggeredBy.id)
      .map(user => ({
        type: NotificationType.ISSUE_STATUS_CHANGED,
        title: 'Status Changed',
        message: `Issue "${issue.title}" status changed from ${oldStatus} to ${newStatus}`,
        userId: user.id,
        issueId: issue.id,
        triggeredById: triggeredBy.id,
        metadata: {
          issueKey: `TASK-${issue.id}`,
          oldStatus,
          newStatus,
        },
      }));

    for (const notificationData of notifications) {
      await this.createNotification(notificationData);
    }
  }

  static async markAsRead(notificationId: number, userId: number): Promise<void> {
    await Notification.update(
      { id: notificationId, userId },
      { isRead: true }
    );
  }

  static async markAllAsRead(userId: number): Promise<void> {
    await Notification.update(
      { userId, isRead: false },
      { isRead: true }
    );
  }

  static async getUserNotifications(
    userId: number,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ notifications: Notification[]; unreadCount: number }> {
    const [notifications, unreadCount] = await Promise.all([
      Notification.find({
        where: { userId },
        relations: ['issue', 'triggeredBy'],
        order: { createdAt: 'DESC' },
        take: limit,
        skip: offset,
      }),
      Notification.count({
        where: { userId, isRead: false },
      }),
    ]);

    return { notifications, unreadCount };
  }
}