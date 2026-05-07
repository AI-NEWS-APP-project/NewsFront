const SIGNUP_NAME_KEY = 'signupName'

export const saveSignupName = (name: string) => {
  localStorage.setItem(SIGNUP_NAME_KEY, name.trim())
}

export const getSignupName = () => {
  return localStorage.getItem(SIGNUP_NAME_KEY) ?? ''
}

export const clearSignupName = () => {
  localStorage.removeItem(SIGNUP_NAME_KEY)
}
