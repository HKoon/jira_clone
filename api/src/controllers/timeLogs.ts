import { TimeLog, Issue } from 'entities';
import { catchErrors } from 'errors';
import { createEntity, updateEntity, deleteEntity, findEntityOrThrow } from 'utils/typeorm';

export const logTime = catchErrors(async (req, res) => {
  const { issueId, timeSpent, description, workDate } = req.body;
  const userId = req.currentUser.id;

  // Verify issue exists and user has access
  await findEntityOrThrow(Issue, issueId);

  const timeLog = await createEntity(TimeLog, {
    issueId,
    userId,
    timeSpent,
    description,
    workDate: workDate || new Date(),
  });

  // Update issue's timeSpent
  const issue = await Issue.findOne({
    where: { id: issueId },
    relations: ['timeLogs'],
  });

  if (issue) {
    const totalTimeSpent = issue.timeLogs.reduce((total, log) => total + log.timeSpent, 0);
    await Issue.update(issueId, { timeSpent: totalTimeSpent });
  }

  res.respond({ timeLog });
});

export const getIssueTimeLogs = catchErrors(async (req, res) => {
  const { issueId } = req.params;

  const timeLogs = await TimeLog.find({
    where: { issueId },
    relations: ['user'],
    order: { workDate: 'DESC', createdAt: 'DESC' },
  });

  res.respond({ timeLogs });
});

export const getUserTimeLogs = catchErrors(async (req, res) => {
  const userId = req.currentUser.id;
  const { startDate, endDate, limit = 50, offset = 0 } = req.query;

  let whereClause: any = { userId };

  if (startDate && endDate) {
    whereClause.workDate = {
      $gte: new Date(startDate as string),
      $lte: new Date(endDate as string),
    };
  }

  const timeLogs = await TimeLog.find({
    where: whereClause,
    relations: ['issue'],
    order: { workDate: 'DESC', createdAt: 'DESC' },
    take: parseInt(limit as string, 10),
    skip: parseInt(offset as string, 10),
  });

  const totalTime = await TimeLog
    .createQueryBuilder('timeLog')
    .select('SUM(timeLog.timeSpent)', 'total')
    .where('timeLog.userId = :userId', { userId })
    .andWhere(startDate && endDate ? 
      'timeLog.workDate BETWEEN :startDate AND :endDate' : '1=1', 
      { startDate, endDate }
    )
    .getRawOne();

  res.respond({ 
    timeLogs, 
    totalTime: parseInt(totalTime.total || '0', 10)
  });
});

export const updateTimeLog = catchErrors(async (req, res) => {
  const { timeLogId } = req.params;
  const userId = req.currentUser.id;
  const { timeSpent, description, workDate } = req.body;

  const timeLog = await findEntityOrThrow(TimeLog, timeLogId);

  // Ensure user can only update their own time logs
  if (timeLog.userId !== userId) {
    return res.status(403).respond({ error: 'Forbidden' });
  }

  const updatedTimeLog = await updateEntity(TimeLog, timeLogId, {
    timeSpent,
    description,
    workDate,
  });

  // Recalculate issue's total time spent
  const issue = await Issue.findOne({
    where: { id: timeLog.issueId },
    relations: ['timeLogs'],
  });

  if (issue) {
    const totalTimeSpent = issue.timeLogs.reduce((total, log) => total + log.timeSpent, 0);
    await Issue.update(timeLog.issueId, { timeSpent: totalTimeSpent });
  }

  res.respond({ timeLog: updatedTimeLog });
});

export const deleteTimeLog = catchErrors(async (req, res) => {
  const { timeLogId } = req.params;
  const userId = req.currentUser.id;

  const timeLog = await findEntityOrThrow(TimeLog, timeLogId);

  // Ensure user can only delete their own time logs
  if (timeLog.userId !== userId) {
    return res.status(403).respond({ error: 'Forbidden' });
  }

  const issueId = timeLog.issueId;
  await deleteEntity(TimeLog, timeLogId);

  // Recalculate issue's total time spent
  const issue = await Issue.findOne({
    where: { id: issueId },
    relations: ['timeLogs'],
  });

  if (issue) {
    const totalTimeSpent = issue.timeLogs.reduce((total, log) => total + log.timeSpent, 0);
    await Issue.update(issueId, { timeSpent: totalTimeSpent });
  }

  res.respond({ success: true });
});

export const getTimeReport = catchErrors(async (req, res) => {
  const { projectId, startDate, endDate, userId } = req.query;
  const currentUserId = req.currentUser.id;

  let whereClause = '';
  const params: any = {};

  if (projectId) {
    whereClause += 'issue.projectId = :projectId';
    params.projectId = projectId;
  }

  if (userId) {
    whereClause += whereClause ? ' AND ' : '';
    whereClause += 'timeLog.userId = :userId';
    params.userId = userId;
  } else {
    // If no specific user, show current user's logs
    whereClause += whereClause ? ' AND ' : '';
    whereClause += 'timeLog.userId = :currentUserId';
    params.currentUserId = currentUserId;
  }

  if (startDate && endDate) {
    whereClause += whereClause ? ' AND ' : '';
    whereClause += 'timeLog.workDate BETWEEN :startDate AND :endDate';
    params.startDate = startDate;
    params.endDate = endDate;
  }

  const timeLogs = await TimeLog
    .createQueryBuilder('timeLog')
    .leftJoinAndSelect('timeLog.issue', 'issue')
    .leftJoinAndSelect('timeLog.user', 'user')
    .where(whereClause, params)
    .orderBy('timeLog.workDate', 'DESC')
    .addOrderBy('timeLog.createdAt', 'DESC')
    .getMany();

  const summary = await TimeLog
    .createQueryBuilder('timeLog')
    .leftJoin('timeLog.issue', 'issue')
    .select('SUM(timeLog.timeSpent)', 'totalTime')
    .addSelect('COUNT(timeLog.id)', 'totalEntries')
    .where(whereClause, params)
    .getRawOne();

  res.respond({
    timeLogs,
    summary: {
      totalTime: parseInt(summary.totalTime || '0', 10),
      totalEntries: parseInt(summary.totalEntries || '0', 10),
    },
  });
});