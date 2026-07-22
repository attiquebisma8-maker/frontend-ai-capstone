import { useState } from 'react'
import {
  initialFormValues,
  validateField,
  validateForm,
} from '../utils/validation'
import './SettingsForm.css'

function FieldError({ id, message }) {
  if (!message) return null
  return (
    <p id={id} className="settings__error" role="alert">
      {message}
    </p>
  )
}

function TextField({
  id,
  label,
  name,
  type = 'text',
  value,
  error,
  hint,
  onChange,
  onBlur,
  ...props
}) {
  const errorId = `${id}-error`

  return (
    <div className="settings__field">
      <label className="settings__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        className={`settings__input${error ? ' settings__input--error' : ''}`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : hint ? `${id}-hint` : undefined}
        {...props}
      />
      <FieldError id={errorId} message={error} />
      {hint && !error ? (
        <p id={`${id}-hint`} className="settings__hint">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export default function SettingsForm() {
  const [values, setValues] = useState(initialFormValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitStatus, setSubmitStatus] = useState('idle')

  const showError = (field) => (touched[field] ? errors[field] : '')

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    const nextValue = type === 'checkbox' ? checked : value

    setValues((current) => {
      const nextValues = { ...current, [name]: nextValue }

      setErrors((currentErrors) => {
        const nextErrors = { ...currentErrors, [name]: validateField(name, nextValue, nextValues) }

        if (name === 'newPassword' || name === 'confirmPassword') {
          nextErrors.confirmPassword = validateField(
            'confirmPassword',
            name === 'confirmPassword' ? nextValue : nextValues.confirmPassword,
            nextValues,
          )
        }

        return nextErrors
      })

      return nextValues
    })

    if (submitStatus === 'success') {
      setSubmitStatus('idle')
    }
  }

  const handleBlur = (event) => {
    const { name, value, type, checked } = event.target
    const fieldValue = type === 'checkbox' ? checked : value

    setTouched((current) => ({ ...current, [name]: true }))
    setErrors((current) => ({
      ...current,
      [name]: validateField(name, fieldValue, values),
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = validateForm(values)
    setErrors(nextErrors)
    setTouched({
      fullName: true,
      email: true,
      username: true,
      bio: true,
      theme: true,
      newPassword: true,
      confirmPassword: true,
    })

    if (Object.keys(nextErrors).length > 0) {
      setSubmitStatus('idle')
      return
    }

    setSubmitStatus('success')
  }

  const handleReset = () => {
    setValues(initialFormValues)
    setErrors({})
    setTouched({})
    setSubmitStatus('idle')
  }

  return (
    <section className="settings">
      <header className="settings__header">
        <h1>Settings</h1>
        <p>Update your profile and preferences.</p>
      </header>

      <form className="settings__form" onSubmit={handleSubmit} noValidate>
        <fieldset className="settings__section">
          <legend className="settings__section-title">Profile</legend>

          <TextField
            id="fullName"
            label="Full name"
            name="fullName"
            value={values.fullName}
            error={showError('fullName')}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="name"
            required
          />

          <TextField
            id="email"
            label="Email"
            name="email"
            type="email"
            value={values.email}
            error={showError('email')}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="email"
            required
          />

          <TextField
            id="username"
            label="Username"
            name="username"
            value={values.username}
            error={showError('username')}
            hint="3–20 characters. Letters, numbers, and underscores only."
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="username"
            required
          />

          <div className="settings__field">
            <label className="settings__label" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              className={`settings__textarea${showError('bio') ? ' settings__textarea--error' : ''}`}
              value={values.bio}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(showError('bio'))}
              aria-describedby={showError('bio') ? 'bio-error' : 'bio-hint'}
              maxLength={160}
            />
            <FieldError id="bio-error" message={showError('bio')} />
            <p id="bio-hint" className="settings__hint">
              {values.bio.length}/160 characters
            </p>
          </div>
        </fieldset>

        <fieldset className="settings__section">
          <legend className="settings__section-title">Preferences</legend>

          <div className="settings__field">
            <label className="settings__label" htmlFor="theme">
              Theme
            </label>
            <select
              id="theme"
              name="theme"
              className={`settings__select${showError('theme') ? ' settings__select--error' : ''}`}
              value={values.theme}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <FieldError id="theme-error" message={showError('theme')} />
          </div>

          <div className="settings__field">
            <div className="settings__checkbox-row">
              <input
                id="emailNotifications"
                name="emailNotifications"
                type="checkbox"
                checked={values.emailNotifications}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <label className="settings__checkbox-label" htmlFor="emailNotifications">
                <span>Email notifications</span>
                <small>Receive updates about your account activity.</small>
              </label>
            </div>
          </div>
        </fieldset>

        <fieldset className="settings__section">
          <legend className="settings__section-title">Security</legend>

          <TextField
            id="newPassword"
            label="New password"
            name="newPassword"
            type="password"
            value={values.newPassword}
            error={showError('newPassword')}
            hint="Leave blank to keep your current password."
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="new-password"
          />

          <TextField
            id="confirmPassword"
            label="Confirm new password"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            error={showError('confirmPassword')}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="new-password"
          />
        </fieldset>

        {submitStatus === 'success' ? (
          <p className="settings__success" role="status">
            Settings saved successfully.
          </p>
        ) : null}

        <div className="settings__actions">
          <button type="submit" className="settings__submit">
            Save changes
          </button>
          <button type="button" className="settings__reset" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
    </section>
  )
}
