import { useForm } from '../../hooks/useForm.js';
import FormField from './FormField.jsx';
import { COPY } from '../../utils/copy.js';
import { COLOR, FONT_SIZE, RADIUS, SPACE } from '../../config/tokens.js';

/**
 * ShippingForm — Step 1 of checkout flow
 * 
 * Collects shipping information with inline validation.
 * Uses useForm hook for state management and validation.
 * All errors announced via aria-describedby.
 * 
 * @param {function} onSubmit - Called with form values when validation passes
 * @param {object} initialValues - Optional initial form values (for restoration)
 */
export default function ShippingForm({ onSubmit, initialValues = {} }) {
  const validate = (values) => {
    const errors = {};

    // Required fields
    if (!values.firstName?.trim()) errors.firstName = 'Required';
    if (!values.lastName?.trim()) errors.lastName = 'Required';
    if (!values.email?.trim()) errors.email = 'Required';
    if (!values.phone?.trim()) errors.phone = 'Required';
    if (!values.address?.trim()) errors.address = 'Required';
    if (!values.city?.trim()) errors.city = 'Required';
    if (!values.state?.trim()) errors.state = 'Required';
    if (!values.zip?.trim()) errors.zip = 'Required';
    if (!values.country?.trim()) errors.country = 'Required';

    // Email format validation
    if (values.email && !/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Invalid email format';
    }

    return errors;
  };

  const { values, errors, handleChange, handleBlur, handleSubmit } = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States',
      ...initialValues,
    },
    validate,
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: `${SPACE[5]}px` }}>
      <h2 style={{ fontSize: `${FONT_SIZE.h3.desktop}px`, color: COLOR.textPrimary, marginBottom: `${SPACE[3]}px` }}>
        {COPY.checkout.shipping.heading}
      </h2>

      {/* Name fields — side by side on desktop */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: `${SPACE[4]}px` }}>
        <FormField
          label={COPY.checkout.shipping.firstName}
          id="firstName"
          name="firstName"
          type="text"
          value={values.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.firstName}
          required
        />
        <FormField
          label={COPY.checkout.shipping.lastName}
          id="lastName"
          name="lastName"
          type="text"
          value={values.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.lastName}
          required
        />
      </div>

      {/* Contact fields */}
      <FormField
        label={COPY.checkout.shipping.email}
        id="email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email}
        required
      />

      <FormField
        label={COPY.checkout.shipping.phone}
        id="phone"
        name="phone"
        type="tel"
        value={values.phone}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.phone}
        required
      />

      {/* Address fields */}
      <FormField
        label={COPY.checkout.shipping.address}
        id="address"
        name="address"
        type="text"
        value={values.address}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.address}
        required
      />

      <FormField
        label={COPY.checkout.shipping.address2}
        id="address2"
        name="address2"
        type="text"
        value={values.address2}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.address2}
      />

      {/* City, State, ZIP — grid layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: `${SPACE[4]}px` }}>
        <FormField
          label={COPY.checkout.shipping.city}
          id="city"
          name="city"
          type="text"
          value={values.city}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.city}
          required
        />
        <FormField
          label={COPY.checkout.shipping.state}
          id="state"
          name="state"
          type="text"
          value={values.state}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.state}
          required
        />
        <FormField
          label={COPY.checkout.shipping.zip}
          id="zip"
          name="zip"
          type="text"
          inputMode="numeric"
          value={values.zip}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.zip}
          required
        />
      </div>

      {/* Country select */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: `${SPACE[1]}px` }}>
        <label
          htmlFor="country"
          style={{
            fontSize: `${FONT_SIZE.caption.desktop}px`,
            color: COLOR.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {COPY.checkout.shipping.country} *
        </label>
        <select
          id="country"
          name="country"
          value={values.country}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-describedby={errors.country ? 'country-error' : undefined}
          aria-invalid={!!errors.country}
          style={{
            width: '100%',
            minHeight: '48px',
            background: COLOR.bgSurface,
            border: `1px solid ${errors.country ? COLOR.accentOrange : 'rgba(255,255,255,0.1)'}`,
            borderRadius: `${RADIUS.md}px`,
            color: COLOR.textPrimary,
            fontSize: `${FONT_SIZE.body.desktop}px`,
            padding: `0 ${SPACE[3]}px`,
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="United States">United States</option>
          <option value="Canada">Canada</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Australia">Australia</option>
          <option value="Germany">Germany</option>
          <option value="France">France</option>
          <option value="Japan">Japan</option>
          <option value="Other">Other</option>
        </select>
        {errors.country && (
          <span
            id="country-error"
            role="alert"
            style={{
              fontSize: `${FONT_SIZE.caption.desktop}px`,
              color: COLOR.accentOrange,
              marginTop: `${SPACE[1]}px`,
            }}
          >
            {errors.country}
          </span>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        style={{
          width: '100%',
          minHeight: '48px',
          background: COLOR.accentOrange,
          color: COLOR.textPrimary,
          fontSize: `${FONT_SIZE.body.desktop}px`,
          fontWeight: 600,
          border: 'none',
          borderRadius: `${RADIUS.md}px`,
          cursor: 'pointer',
          marginTop: `${SPACE[3]}px`,
          transition: 'opacity 200ms ease',
        }}
        onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
        onMouseLeave={(e) => (e.target.style.opacity = '1')}
      >
        {COPY.checkout.shipping.continueToPayment}
      </button>
    </form>
  );
}
