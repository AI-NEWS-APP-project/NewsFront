import { useState } from 'react'

export type SignupFieldId = 'name' | 'email' | 'password' | 'confirmPassword'
export type SignupFormData = Record<SignupFieldId, string>
type SignupFieldErrors = Partial<Record<SignupFieldId, string>>

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}\-_=+\\|;:'",.<>/?`~]).{8,}$/

const FIELD_LABELS: Record<SignupFieldId, string> = {
  name: '이름',
  email: '이메일 주소',
  password: '비밀번호',
  confirmPassword: '비밀번호 확인',
}

const INITIAL_FORM_DATA: SignupFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

interface UseSignupFormOptions {
  onSubmitSuccess: (formData: SignupFormData) => void
}

export function useSignupForm({ onSubmitSuccess }: UseSignupFormOptions) {
  const [formData, setFormData] = useState<SignupFormData>(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState<SignupFieldErrors>({})
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const validateField = (
    field: SignupFieldId,
    nextFormData: SignupFormData
  ) => {
    const value = nextFormData[field].trim()

    if (!value) {
      return ''
    }

    if (field === 'email' && !EMAIL_REGEX.test(value)) {
      return '올바른 이메일 형식을 입력해 주세요.'
    }

    if (field === 'password' && !PASSWORD_REGEX.test(value)) {
      return '비밀번호는 8자 이상이며 영문,숫자,특수문자를 포함해야 합니다.'
    }

    if (
      field === 'confirmPassword' &&
      nextFormData.confirmPassword &&
      nextFormData.password !== nextFormData.confirmPassword
    ) {
      return '비밀번호가 일치하지 않습니다.'
    }

    return ''
  }

  const validateForm = (nextFormData: SignupFormData) => {
    const nextErrors: SignupFieldErrors = {}

    ;(Object.keys(FIELD_LABELS) as SignupFieldId[]).forEach(field => {
      if (!nextFormData[field].trim()) {
        nextErrors[field] = `${FIELD_LABELS[field]}을(를) 입력해 주세요.`
        return
      }

      const error = validateField(field, nextFormData)
      if (error) {
        nextErrors[field] = error
      }
    })

    return nextErrors
  }

  const handleChange = (field: SignupFieldId, value: string) => {
    const nextFormData = { ...formData, [field]: value }
    setFormData(nextFormData)

    if (!hasSubmitted) {
      return
    }

    setErrors(prev => {
      const nextErrors = { ...prev }
      const relatedFields: SignupFieldId[] =
        field === 'password'
          ? ['password', 'confirmPassword']
          : field === 'confirmPassword'
            ? ['confirmPassword']
            : [field]

      relatedFields.forEach(targetField => {
        const error = validateField(targetField, nextFormData)

        if (error) {
          nextErrors[targetField] = error
        } else {
          delete nextErrors[targetField]
        }
      })

      return nextErrors
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setHasSubmitted(true)

    const nextErrors = validateForm(formData)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    onSubmitSuccess(formData)
  }

  const isPasswordMatched =
    !!formData.confirmPassword &&
    formData.password === formData.confirmPassword &&
    !errors.confirmPassword

  return {
    formData,
    errors,
    isPasswordMatched,
    handleChange,
    handleSubmit,
  }
}
