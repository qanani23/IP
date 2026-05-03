// ─── useForm ──────────────────────────────────────────────────────────────────
// Reusable form state and validation hook.
// Used by ShippingForm and PaymentForm.
//
// Design rules:
// - Errors only shown after first submit attempt (not on initial render)
// - Each handleSubmit call is independent — no accumulated state between calls
// - handleChange updates values immediately (no debounce at this layer)

import { useState, useCallback } from 'react';

/**
 * @param {object} options
 * @param {object} options.initialValues - Initial field values
 * @param {function} options.validate - (values) => errors object (empty = valid)
 * @param {function} options.onSubmit - Called with values when validation passes
 * @returns {{ values, errors, touched, handleChange, handleBlur, handleSubmit, reset, isSubmitting }}
 */
export function useForm({ initialValues, validate, onSubmit }) {
  const [values, setValues]           = useState(initialValues);
  const [errors, setErrors]           = useState({});
  const [touched, setTouched]         = useState({});
  const [submitted, setSubmitted]     = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setValues((prev) => ({ ...prev, [name]: newValue }));

    // Re-validate the changed field if the form has been submitted once
    if (submitted && validate) {
      const newValues = { ...values, [name]: newValue };
      const newErrors = validate(newValues);
      setErrors(newErrors);
    }
  }, [values, submitted, validate]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate on blur after first submit
    if (submitted && validate) {
      const newErrors = validate(values);
      setErrors(newErrors);
    }
  }, [values, submitted, validate]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault();
      setSubmitted(true);

      const validationErrors = validate ? validate(values) : {};
      setErrors(validationErrors);

      // Mark all fields as touched on submit
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(allTouched);

      if (Object.keys(validationErrors).length > 0) {
        // Validation failed — do not call onSubmit
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );

  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setSubmitted(false);
    setIsSubmitting(false);
  }, [initialValues]);

  // Populate form with saved values (e.g. from localStorage restore)
  const setFieldValues = useCallback((newValues) => {
    setValues((prev) => ({ ...prev, ...newValues }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValues,
  };
}
