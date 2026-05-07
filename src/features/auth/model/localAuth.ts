import type { SignupFormData } from './useSignupForm'

const REGISTERED_USER_KEY = 'briefy-registered-user'

export interface RegisteredUser {
  id: string
  name: string
  email: string
  password: string
}

export function saveRegisteredUser(formData: SignupFormData) {
  const registeredUser: RegisteredUser = {
    id: crypto.randomUUID(),
    name: formData.name.trim(),
    email: formData.email.trim().toLowerCase(),
    password: formData.password,
  }

  localStorage.setItem(REGISTERED_USER_KEY, JSON.stringify(registeredUser))

  return registeredUser
}

export function getRegisteredUser() {
  const rawUser = localStorage.getItem(REGISTERED_USER_KEY)

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as RegisteredUser
  } catch {
    localStorage.removeItem(REGISTERED_USER_KEY)
    return null
  }
}

export function verifyRegisteredUser(email: string, password: string) {
  const registeredUser = getRegisteredUser()

  if (!registeredUser) {
    return null
  }

  const normalizedEmail = email.trim().toLowerCase()

  if (
    registeredUser.email !== normalizedEmail ||
    registeredUser.password !== password
  ) {
    return null
  }

  return registeredUser
}
