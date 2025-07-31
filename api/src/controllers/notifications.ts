import { catchErrors } from 'errors';
import { NotificationService } from 'services/notificationService';
import { findEntityOrThrow } from 'utils/typeorm';
import { Notification } from 'entities';

export const getUserNotifications = catchErrors(async (req, res) => {
  const { limit = 20, offset = 0 } = req.query;
  const userId = req.currentUser.id;

  const result = await NotificationService.getUserNotifications(
    userId,
    parseInt(limit as string, 10),
    parseInt(offset as string, 10)
  );

  res.respond(result);
});

export const markAsRead = catchErrors(async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.currentUser.id;

  await NotificationService.markAsRead(parseInt(notificationId, 10), userId);
  
  res.respond({ success: true });
});

export const markAllAsRead = catchErrors(async (req, res) => {
  const userId = req.currentUser.id;

  await NotificationService.markAllAsRead(userId);
  
  res.respond({ success: true });
});

export const getUnreadCount = catchErrors(async (req, res) => {
  const userId = req.currentUser.id;
  
  const unreadCount = await Notification.count({
    where: { userId, isRead: false },
  });

  res.respond({ unreadCount });
});

export const deleteNotification = catchErrors(async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.currentUser.id;

  const notification = await findEntityOrThrow(Notification, notificationId);
  
  // Ensure user can only delete their own notifications
  if (notification.userId !== userId) {
    return res.status(403).respond({ error: 'Forbidden' });
  }

  await notification.remove();
  
  res.respond({ success: true });
});