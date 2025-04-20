export interface StravaInfo {
  profilePic?: string;
  profilePicMedium?: string;
  username?: string;
  id: number;
}

export interface UserSettings {
  updateStravaDesc: number;
}

export interface UserSettingsPartial {
  updateStravaDesc?: number;
}
