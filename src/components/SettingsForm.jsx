import { useId, useRef, useState } from 'react'
import {
  initialFormValues,
  validateField,
  validateForm,
} from '../utils/validation'
import './SettingsForm.css'

function getDescribedBy({ errorId, hintId, error, hint }) {
  const ids = []
  if (error) ids.push(errorId)
  if (hint) ids.push(hintId)
  return ids.length > 0 ? ids.join(' ') : undefined
}

function FieldError({ id, message }) {
  if (!message) return null
  return (
    <p id={id} className="settings__error" aria-live="polite">
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
  required = false,
  onChange,
  onBlur,
  ...props
}) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  return (
    <div className="settings__field">
      <label className="settings__label" htmlFor={id}>
        {label}
        {required ? <span className="settings__required"> (required)</span> : null}
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
        aria-required={required}
        aria-describedby={getDescribedBy({ errorId, hintId, error, hint })}
        required={required}
        {...props}
      />
      <FieldError id={errorId} message={error} />
      {hint ? (
        <p id={hintId} className="settings__hint">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

function TextAreaField({
  id,
  label,
  name,
  value,
  error,
  hint,
  onChange,
  onBlur,
  maxLength,
}) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  return (
    <div className="settings__field">
      <label className="settings__label" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        className={`settings__textarea${error ? ' settings__textarea--error' : ''}`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={getDescribedBy({ errorId, hintId, error, hint })}
        maxLength={maxLength}
      />
      <FieldError id={errorId} message={error} />
      {hint ? (
        <p id={hintId} className="settings__hint">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

const FORM_FIELDS = [
  'fullName',
  'email',
  'username',
  'bio',
  'password',
  'confirmPassword',
]

function buildFieldErrors(nextValues) {
  return FORM_FIELDS.reduce((errors, field) => {
    const message = validateField(field, nextValues[field], nextValues)
    if (message) errors[field] = message
    return errors
  }, {})
}

export default function SettingsForm() {
  const formTitleId = useId()
  const formRef = useRef(null)
  const [values, setValues] = useState(initialFormValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitStatus, setSubmitStatus] = useState('idle')

  const showError = (field) => (touched[field] ? errors[field] : '')

  const handleChange = (event) => {
    const { name, value } = event.target

    setValues((current) => {
      const nextValues = { ...current, [name]: value }
      setErrors(buildFieldErrors(nextValues))
      return nextValues
    })

    if (submitStatus === 'success') {
      setSubmitStatus('idle')
    }
  }

  const handleBlur = (event) => {
    const { name } = event.target

    setTouched((current) => ({ ...current, [name]: true }))
    setValues((current) => {
      setErrors(buildFieldErrors(current))
      return current
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = validateForm(values)
    setErrors(nextErrors)
    setTouched(Object.fromEntries(FORM_FIELDS.map((field) => [field, true])))

    if (Object.keys(nextErrors).length > 0) {
      setSubmitStatus('idle')
      const firstInvalidField = FORM_FIELDS.find((field) => nextErrors[field])
      formRef.current?.querySelector(`#${firstInvalidField}`)?.focus()
      return
    }

    setSubmitStatus('success')
  }

  const handleReset = () => {
    setValues(initialFormValues)
    setErrors({})
    setTouched({})
    setSubmitStatus('idle')
    formRef.current?.querySelector('#fullName')?.focus()
  }

  return (
    <section className="settings" aria-labelledby={formTitleId}>
      <header className="settings__header">
        <h1 id={formTitleId}>Settings</h1>
        <p>Update your profile information.</p>
      </header>

      <form
        ref={formRef}
        className="settings__form"
        onSubmit={handleSubmit}
        noValidate
      >
        <TextField
          id="fullName"
          label="Full Name"
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

        <TextAreaField
          id="bio"
          label="Bio"
          name="bio"
          value={values.bio}
          error={showError('bio')}
          hint={`${values.bio.length}/160 characters`}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={160}
        />

        <TextField
          id="password"
          label="Password"
          name="password"
          type="password"
          value={values.password}
          error={showError('password')}
          hint="At least 8 characters."
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="new-password"
          required
        />

        <TextField
          id="confirmPassword"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          error={showError('confirmPassword')}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="new-password"
          required
        />

        {submitStatus === 'success' ? (
          <p className="settings__success" role="status">
            Settings saved successfully.
          </p>
        ) : null}

        <div className="settings__actions">
          <button type="submit" className="settings__submit">
            Save
          </button>
          <button type="button" className="settings__reset" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
    </section>
  )
}
