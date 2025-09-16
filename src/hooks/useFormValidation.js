import { useState, useEffect } from 'react'

export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = (fieldName, value) => {
    if (!validationRules[fieldName]) return ''

    const rules = validationRules[fieldName]
    
    // Required check
    if (rules.required && (!value || value.toString().trim() === '')) {
      return rules.required.message || `${fieldName} is required`
    }

    // Min length check
    if (rules.minLength && value && value.length < rules.minLength.value) {
      return rules.minLength.message || `Minimum ${rules.minLength.value} characters required`
    }

    // Max length check
    if (rules.maxLength && value && value.length > rules.maxLength.value) {
      return rules.maxLength.message || `Maximum ${rules.maxLength.value} characters allowed`
    }

    // Pattern check
    if (rules.pattern && value && !rules.pattern.value.test(value)) {
      return rules.pattern.message || 'Invalid format'
    }

    // Custom validation
    if (rules.custom) {
      return rules.custom(value, values) || ''
    }

    return ''
  }

  const validateAll = () => {
    const newErrors = {}
    Object.keys(validationRules).forEach(fieldName => {
      const error = validate(fieldName, values[fieldName])
      if (error) {
        newErrors[fieldName] = error
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (fieldName, value) => {
    setValues(prev => ({
      ...prev,
      [fieldName]: value
    }))

    // Validate field on change if it's been touched
    if (touched[fieldName]) {
      const error = validate(fieldName, value)
      setErrors(prev => ({
        ...prev,
        [fieldName]: error
      }))
    }
  }

  const handleBlur = (fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }))

    // Validate field on blur
    const error = validate(fieldName, values[fieldName])
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }))
  }

  const reset = (newValues = initialValues) => {
    setValues(newValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0 && Object.keys(touched).length > 0
  }
}

// Common validation rules
export const validationRules = {
  email: {
    required: { message: 'Email is required' },
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Please enter a valid email address'
    }
  },
  password: {
    required: { message: 'Password is required' },
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters long'
    }
  },
  name: {
    required: { message: 'Name is required' },
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters long'
    },
    maxLength: {
      value: 50,
      message: 'Name cannot exceed 50 characters'
    }
  },
  confirmPassword: {
    required: { message: 'Please confirm your password' },
    custom: (value, values) => {
      if (value !== values.password) {
        return 'Passwords do not match'
      }
    }
  }
}