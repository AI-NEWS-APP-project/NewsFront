import type {
  SummaryTimes,
} from '@features/onboarding/model/useOnboardingState'

const NOTIFICATION_SETTINGS_KEY = 'briefy-notification-settings'

export interface NotificationSettings {
  realtime: boolean
  dailySummary: boolean
  summaryTimes: SummaryTimes
}

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  realtime: true,
  dailySummary: true,
  summaryTimes: ['morning'],
}

export function getNotificationSettings(): NotificationSettings {
  const rawValue = localStorage.getItem(NOTIFICATION_SETTINGS_KEY)

  if (!rawValue) {
    return DEFAULT_NOTIFICATION_SETTINGS
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<NotificationSettings>

    return {
      realtime: parsedValue.realtime ?? DEFAULT_NOTIFICATION_SETTINGS.realtime,
      dailySummary:
        parsedValue.dailySummary ?? DEFAULT_NOTIFICATION_SETTINGS.dailySummary,
      summaryTimes:
        parsedValue.summaryTimes?.length
          ? parsedValue.summaryTimes
          : DEFAULT_NOTIFICATION_SETTINGS.summaryTimes,
    }
  } catch {
    localStorage.removeItem(NOTIFICATION_SETTINGS_KEY)
    return DEFAULT_NOTIFICATION_SETTINGS
  }
}

export function saveNotificationSettings(settings: NotificationSettings) {
  localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings))
}
