const ONBOARDING_STATUS_KEY = 'briefy-onboarding-complete'

type OnboardingStatusMap = Record<string, boolean>

function readOnboardingStatusMap(): OnboardingStatusMap {
  const rawValue = localStorage.getItem(ONBOARDING_STATUS_KEY)

  if (!rawValue) {
    return {}
  }

  try {
    return JSON.parse(rawValue) as OnboardingStatusMap
  } catch {
    localStorage.removeItem(ONBOARDING_STATUS_KEY)
    return {}
  }
}

function writeOnboardingStatusMap(statusMap: OnboardingStatusMap) {
  localStorage.setItem(ONBOARDING_STATUS_KEY, JSON.stringify(statusMap))
}

export function hasCompletedOnboarding(userId: string | number) {
  const statusMap = readOnboardingStatusMap()
  return statusMap[String(userId)] === true
}

export function markOnboardingCompleted(userId: string | number) {
  const statusMap = readOnboardingStatusMap()
  statusMap[String(userId)] = true
  writeOnboardingStatusMap(statusMap)
}
