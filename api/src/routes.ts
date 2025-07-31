import * as authentication from 'controllers/authentication';
import * as comments from 'controllers/comments';
import * as issues from 'controllers/issues';
import * as notifications from 'controllers/notifications';
import * as projects from 'controllers/projects';
import * as test from 'controllers/test';
import * as timeLogs from 'controllers/timeLogs';
import * as users from 'controllers/users';

export const attachPublicRoutes = (app: any): void => {
  if (process.env.NODE_ENV === 'test') {
    app.delete('/test/reset-database', test.resetDatabase);
    app.post('/test/create-account', test.createAccount);
  }

  app.post('/authentication/guest', authentication.createGuestAccount);
  app.post('/authentication/register', authentication.register);
  app.post('/authentication/login', authentication.login);
};

export const attachPrivateRoutes = (app: any): void => {
  app.post('/comments', comments.create);
  app.put('/comments/:commentId', comments.update);
  app.delete('/comments/:commentId', comments.remove);

  app.get('/issues', issues.getProjectIssues);
  app.get('/issues/:issueId', issues.getIssueWithUsersAndComments);
  app.post('/issues', issues.create);
  app.put('/issues/:issueId', issues.update);
  app.delete('/issues/:issueId', issues.remove);

  app.get('/project', projects.getProjectWithUsersAndIssues);
  app.put('/project', projects.update);

  app.get('/currentUser', authentication.getCurrentUser);

  app.get('/notifications', notifications.getUserNotifications);
  app.put('/notifications/:notificationId/read', notifications.markAsRead);
  app.put('/notifications/mark-all-read', notifications.markAllAsRead);
  app.get('/notifications/unread-count', notifications.getUnreadCount);
  app.delete('/notifications/:notificationId', notifications.deleteNotification);

  app.post('/time-logs', timeLogs.logTime);
  app.get('/issues/:issueId/time-logs', timeLogs.getIssueTimeLogs);
  app.get('/time-logs/user', timeLogs.getUserTimeLogs);
  app.put('/time-logs/:timeLogId', timeLogs.updateTimeLog);
  app.delete('/time-logs/:timeLogId', timeLogs.deleteTimeLog);
  app.get('/time-logs/report', timeLogs.getTimeReport);
};
