import { DateTime } from 'luxon';

export interface Athlete {
  id: number;
  createdAt: DateTime;
  lastBacklogSync?: DateTime;
  backlogSyncEligible: boolean;
  stravaAccountCreatedAt: DateTime;
  unprocessedActivities: number;
}
