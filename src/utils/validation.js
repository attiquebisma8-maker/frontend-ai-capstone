const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/

export const initialFormValues = {
  fullName: '',
  email: '',
  username: '',
  bio: '',
  theme: 'system',
  emailNotifications: true,
  newPassword: '',
  confirmPassword: '',
}

export function validateField(name, value, values = initialFormValues) {
  switch (name) {
    case 'fullName': {
      const trimmed = value.trim()
      if (!trimmed) return 'Full name is required'
      if (trimmed.length < 2) return 'Full name must be at least 2 characters'
      if (trimmed.length > 50) return 'Full name must be 50 characters or less'
      return ''
    }
    case 'email': {
      const trimmed = value.trim()
      if (!trimmed) return 'Email is required'
      if (!EMAIL_PATTERN.test(trimmed)) return 'Enter a valid email address'
      return ''
    }
    case 'username': {
      const trimmed = value.trim()
      if (!trimmed) return 'Username is required'
      if (trimmed.length < 3) return 'Username must be at least 3 characters'
      if (trimmed.length > 20) return 'Username must be 20 characters or less'
      if (!USERNAME_PATTERN.test(trimmed)) {
        return 'Username can only contain letters, numbers, and underscores'
      }
      return ''
    }
    case 'bio': {
      if (value.length > 160) return 'Bio must be 160 characters or less'
      return ''
    }
    case 'theme':
      if (!['light', 'dark', 'system'].includes(value)) return 'Select a valid theme'
      return ''
    case 'newPassword': {
      if (!value) return ''
      if (value.length < 8) return 'Password must be at least 8 characters'
      return ''
    }
    case 'confirmPassword': {
      if (!values.newPassword && !value) return ''
      if (!value) return 'Confirm your new password'
      if (value !== values.newPassword) return 'Passwords do not match'
      return ''
    }
    default:
      return ''
  }
}

export function validateForm(values) {
  const fields = [
    'fullName',
    'email',
    'username',
    'bio',
    'theme',
    'newPassword',
    'confirmPassword',
  ]

  return fields.reduce((errors, field) => {
    const message = validateField(field, values[field], values)
    if (message) errors[field] = message
    return errors
  }, {})
}
