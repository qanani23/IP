// ─── useForm Property Tests ──────────────────────────────────────────────────
// Property-based tests for useForm hook correctness properties.
//
// P-S7: handleSubmit → modify field → handleSubmit
//       → two independent validation results, no shared state

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useForm } from './useForm.js';

// ─── Test Helpers ─────────────────────────────────────────────────────────────

function createValidate(rules = {}) {
  return (values) => {
    const errors = {};
    
    if (rules.required) {
      rules.required.forEach(field => {
        if (!values[field] || values[field].trim() === '') {
          errors[field] = `${field} is required`;
        }
      });
    }
    
    if (rules.email && values.email) {
      if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = 'Invalid email format';
      }
    }
    
    if (rules.minLength) {
      Object.entries(rules.minLength).forEach(([field, min]) => {
        if (values[field] && values[field].length < min) {
          errors[field] = `${field} must be at least ${min} characters`;
        }
      });
    }
    
    return errors;
  };
}

// ─── P-S7: Form Independence ──────────────────────────────────────────────────

describe('P-S7: Independent validation results across submissions', () => {
  it('produces independent validation results for two sequential submissions', () => {
    const onSubmit = vi.fn();
    const validate = createValidate({
      required: ['firstName', 'email'],
      email: true,
    });

    const { result } = renderHook(() =>
      useForm({
        initialValues: { firstName: '', email: '' },
        validate,
        onSubmit,
      })
    );

    // First submission with empty values
    act(() => {
      result.current.handleSubmit();
    });

    const firstErrors = { ...result.current.errors };
    expect(firstErrors.firstName).toBe('firstName is required');
    expect(firstErrors.email).toBe('email is required');
    expect(onSubmit).not.toHaveBeenCalled();

    // Modify fields
    act(() => {
      result.current.handleChange({
        target: { name: 'firstName', value: 'John' },
      });
      result.current.handleChange({
        target: { name: 'email', value: 'john@example.com' },
      });
    });

    // Second submission with valid values
    act(() => {
      result.current.handleSubmit();
    });

    const secondErrors = { ...result.current.errors };
    expect(Object.keys(secondErrors).length).toBe(0);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      firstName: 'John',
      email: 'john@example.com',
    });

    // Verify first and second errors are independent
    expect(firstErrors).not.toEqual(secondErrors);
  });

  it('maintains independence across multiple submit-modify-submit cycles', () => {
    const onSubmit = vi.fn();
    const validate = createValidate({
      required: ['name'],
      minLength: { name: 3 },
    });

    const { result } = renderHook(() =>
      useForm({
        initialValues: { name: '' },
        validate,
        onSubmit,
      })
    );

    const errorSnapshots = [];

    // Cycle 1: Empty name
    act(() => {
      result.current.handleSubmit();
    });
    errorSnapshots.push({ ...result.current.errors });
    expect(errorSnapshots[0].name).toBe('name is required');

    // Modify: name = 'Jo' (too short)
    act(() => {
      result.current.handleChange({ target: { name: 'name', value: 'Jo' } });
    });

    // Cycle 2: Short name
    act(() => {
      result.current.handleSubmit();
    });
    errorSnapshots.push({ ...result.current.errors });
    expect(errorSnapshots[1].name).toBe('name must be at least 3 characters');

    // Modify: name = 'John' (valid)
    act(() => {
      result.current.handleChange({ target: { name: 'name', value: 'John' } });
    });

    // Cycle 3: Valid name
    act(() => {
      result.current.handleSubmit();
    });
    errorSnapshots.push({ ...result.current.errors });
    expect(Object.keys(errorSnapshots[2]).length).toBe(0);

    // Verify all three error states are independent
    expect(errorSnapshots[0]).not.toEqual(errorSnapshots[1]);
    expect(errorSnapshots[1]).not.toEqual(errorSnapshots[2]);
    expect(errorSnapshots[0]).not.toEqual(errorSnapshots[2]);
  });

  it('does not accumulate errors across submissions', () => {
    const onSubmit = vi.fn();
    const validate = (values) => {
      const errors = {};
      if (!values.field1) errors.field1 = 'Field 1 required';
      if (!values.field2) errors.field2 = 'Field 2 required';
      if (!values.field3) errors.field3 = 'Field 3 required';
      return errors;
    };

    const { result } = renderHook(() =>
      useForm({
        initialValues: { field1: '', field2: '', field3: '' },
        validate,
        onSubmit,
      })
    );

    // Submit 1: All fields empty
    act(() => {
      result.current.handleSubmit();
    });
    expect(Object.keys(result.current.errors).length).toBe(3);

    // Fix field1
    act(() => {
      result.current.handleChange({ target: { name: 'field1', value: 'value1' } });
    });

    // Submit 2: Only field1 valid
    act(() => {
      result.current.handleSubmit();
    });
    expect(Object.keys(result.current.errors).length).toBe(2);
    expect(result.current.errors.field1).toBeUndefined();
    expect(result.current.errors.field2).toBe('Field 2 required');
    expect(result.current.errors.field3).toBe('Field 3 required');

    // Fix field2
    act(() => {
      result.current.handleChange({ target: { name: 'field2', value: 'value2' } });
    });

    // Submit 3: field1 and field2 valid
    act(() => {
      result.current.handleSubmit();
    });
    expect(Object.keys(result.current.errors).length).toBe(1);
    expect(result.current.errors.field1).toBeUndefined();
    expect(result.current.errors.field2).toBeUndefined();
    expect(result.current.errors.field3).toBe('Field 3 required');

    // Fix field3
    act(() => {
      result.current.handleChange({ target: { name: 'field3', value: 'value3' } });
    });

    // Submit 4: All valid
    act(() => {
      result.current.handleSubmit();
    });
    expect(Object.keys(result.current.errors).length).toBe(0);
  });

  it('validates independently when values change between submissions', () => {
    const onSubmit = vi.fn();
    const validate = createValidate({
      required: ['email'],
      email: true,
    });

    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: '' },
        validate,
        onSubmit,
      })
    );

    // Submit with invalid email
    act(() => {
      result.current.handleChange({ target: { name: 'email', value: 'invalid' } });
    });
    act(() => {
      result.current.handleSubmit();
    });
    expect(result.current.errors.email).toBe('Invalid email format');

    // Change to valid email
    act(() => {
      result.current.handleChange({ target: { name: 'email', value: 'valid@example.com' } });
    });
    act(() => {
      result.current.handleSubmit();
    });
    expect(result.current.errors.email).toBeUndefined();

    // Change back to invalid
    act(() => {
      result.current.handleChange({ target: { name: 'email', value: 'bad-email' } });
    });
    act(() => {
      result.current.handleSubmit();
    });
    expect(result.current.errors.email).toBe('Invalid email format');

    // Each validation is independent
    expect(onSubmit).toHaveBeenCalledTimes(1); // Only called once when valid
  });

  it('handles async onSubmit without state leakage', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const validate = createValidate({ required: ['name'] });

    const { result } = renderHook(() =>
      useForm({
        initialValues: { name: '' },
        validate,
        onSubmit,
      })
    );

    // First submit: invalid
    act(() => {
      result.current.handleSubmit();
    });
    expect(result.current.errors.name).toBe('name is required');

    // Fix and submit: valid
    act(() => {
      result.current.handleChange({ target: { name: 'name', value: 'John' } });
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(Object.keys(result.current.errors).length).toBe(0);
    expect(onSubmit).toHaveBeenCalledTimes(1);

    // Break again and submit: invalid
    act(() => {
      result.current.handleChange({ target: { name: 'name', value: '' } });
    });
    act(() => {
      result.current.handleSubmit();
    });
    expect(result.current.errors.name).toBe('name is required');
    expect(onSubmit).toHaveBeenCalledTimes(1); // Still only called once
  });

  it('produces independent results with complex validation rules', () => {
    const onSubmit = vi.fn();
    const validate = (values) => {
      const errors = {};
      
      // Complex interdependent validation
      if (!values.password) {
        errors.password = 'Password required';
      } else if (values.password.length < 8) {
        errors.password = 'Password too short';
      }
      
      if (!values.confirmPassword) {
        errors.confirmPassword = 'Confirm password required';
      } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      
      return errors;
    };

    const { result } = renderHook(() =>
      useForm({
        initialValues: { password: '', confirmPassword: '' },
        validate,
        onSubmit,
      })
    );

    // Submit 1: Both empty
    act(() => {
      result.current.handleSubmit();
    });
    const errors1 = { ...result.current.errors };
    expect(errors1.password).toBe('Password required');
    expect(errors1.confirmPassword).toBe('Confirm password required');

    // Submit 2: Password too short
    act(() => {
      result.current.handleChange({ target: { name: 'password', value: 'short' } });
    });
    act(() => {
      result.current.handleSubmit();
    });
    const errors2 = { ...result.current.errors };
    expect(errors2.password).toBe('Password too short');
    expect(errors2.confirmPassword).toBe('Confirm password required');

    // Submit 3: Passwords don't match
    act(() => {
      result.current.handleChange({ target: { name: 'password', value: 'password123' } });
      result.current.handleChange({ target: { name: 'confirmPassword', value: 'different123' } });
    });
    act(() => {
      result.current.handleSubmit();
    });
    const errors3 = { ...result.current.errors };
    expect(errors3.password).toBeUndefined();
    expect(errors3.confirmPassword).toBe('Passwords do not match');

    // Submit 4: Valid
    act(() => {
      result.current.handleChange({ target: { name: 'confirmPassword', value: 'password123' } });
    });
    act(() => {
      result.current.handleSubmit();
    });
    const errors4 = { ...result.current.errors };
    expect(Object.keys(errors4).length).toBe(0);

    // All error states are independent
    expect(errors1).not.toEqual(errors2);
    expect(errors2).not.toEqual(errors3);
    expect(errors3).not.toEqual(errors4);
  });

  it('resets to clean state after reset() call', () => {
    const onSubmit = vi.fn();
    const validate = createValidate({ required: ['name'] });

    const { result } = renderHook(() =>
      useForm({
        initialValues: { name: '' },
        validate,
        onSubmit,
      })
    );

    // Submit with error
    act(() => {
      result.current.handleSubmit();
    });
    expect(result.current.errors.name).toBe('name is required');

    // Modify
    act(() => {
      result.current.handleChange({ target: { name: 'name', value: 'John' } });
    });

    // Reset
    act(() => {
      result.current.reset();
    });

    // Should be back to initial state
    expect(result.current.values.name).toBe('');
    expect(Object.keys(result.current.errors).length).toBe(0);
    expect(Object.keys(result.current.touched).length).toBe(0);

    // New submission should be independent
    act(() => {
      result.current.handleSubmit();
    });
    expect(result.current.errors.name).toBe('name is required');
  });
});
