import { useState } from 'react';
import { useForm } from '../../hooks/useForm.js';
import FormField from './FormField.jsx';
import { COPY } from '../../utils/copy.js';
import { COLOR, FONT_SIZE, RADIUS, SPACE } from '../../config/tokens.js';

/**
 * PaymentForm — Step 2 of checkout flow
 * 
 * Collects payment information with inline validation.
 * Card number is masked on blur (•••• •••• •••• 1234) but raw value retained for validation.
 * Expiry must be a future date.
 * 
 * @param {function} onSubmit - Called with form values when validation passes
 * @param {object} initialValues - Optional initial form values (for restoration, never includes card number)
 */
export default function PaymentForm({ onSubmit, initialValues = {} }) {
  const [cardFocused, setCardFocused] = useState(false);

  const validate = (values) => {
    const errors = {};

    // Required fields
    if (!values.cardNumber?.trim()) {
      errors.cardNumber = 'Required';
    } else {
      // Remove all non-digits for validation
      const digits = values.cardNumber.replace(/\D/g, '');
      if (digits.length !== 16) {
        errors.cardNumber = 'Card number must be 16 digits';
      }
    }

    if (!values.cardName?.trim()) errors.cardName = 'Required';
    if (!values.expiry?.trim()) {
      errors.expiry = 'Required';
    } else {
      // Validate expiry format (MM/YY) and future date
      const expiryMatch = values.expiry.match(/^(\d{2})\/(\d{2})$/);
      if (!expiryMatch) {
        errors.expiry = 'Format: MM/YY';
      } else {
        const [, month, year] = expiryMatch;
        const expMonth = parseInt(month, 10);
        const expYear = parseInt(year, 10) + 2000; // Convert YY to YYYY

        if (expMonth < 1 || expMonth > 12) {
          errors.expiry = 'Invalid month';
        } else {
          const now = new Date();
          const currentYear = now.getFullYear();
          const currentMonth = now.getMonth() + 1;

          if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            errors.expiry = 'Card has expired';
          }
        }
      }
    }

    if (!values.cvv?.trim()) {
      errors.cvv = 'Required';
    } else {
      const cvvDigits = values.cvv.replace(/\D/g, '');
      if (cvvDigits.length < 3 || cvvDigits.length > 4) {
        errors.cvv = 'CVV must be 3-4 digits';
      }
    }

    return errors;
  };

  const { values, errors, handleChange, handleBlur, handleSubmit } = useForm({
    initialValues: {
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvv: '',
      ...initialValues,
    },
    validate,
    onSubmit,
  });

  /**
   * Masks card number for display: •••• •••• •••• 1234
   * Only masks when field is not focused.
   */
  const getMaskedCardNumber = (raw) => {
    if (cardFocused || !raw) return raw;
    
    const digits = raw.replace(/\D/g, '');
    if (digits.length < 4) return raw;

    const lastFour = digits.slice(-4);
    const maskedGroups = Math.ceil((digits.length - 4) / 4);
    const masked = Array(maskedGroups).fill('••••').join(' ');
    
    return `${masked} ${lastFour}`;
  };

  /**
   * Formats card number with spaces: 1234 5678 9012 3456
   */
  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    const groups = digits.match(/.{1,4}/g) || [];
    return groups.join(' ');
  };

  /**
   * Formats expiry as MM/YY
   */
  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    handleChange({ ...e, target: { ...e.target, value: formatted } });
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    handleChange({ ...e, target: { ...e.target, value: formatted } });
  };

  const handleCvvChange = (e) => {
    // Only allow digits, max 4
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    handleChange({ ...e, target: { ...e.target, value: digits } });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: `${SPACE[5]}px` }}>
      <h2 style={{ fontSize: `${FONT_SIZE.h3.desktop}px`, color: COLOR.textPrimary, marginBottom: `${SPACE[3]}px` }}>
        {COPY.checkout.payment.heading}
      </h2>

      {/* Card number with masking */}
      <FormField
        label={COPY.checkout.payment.cardNumber}
        id="cardNumber"
        name="cardNumber"
        type="text"
        inputMode="numeric"
        value={getMaskedCardNumber(values.cardNumber)}
        onChange={handleCardNumberChange}
        onBlur={(e) => {
          setCardFocused(false);
          handleBlur(e);
        }}
        onFocus={() => setCardFocused(true)}
        error={errors.cardNumber}
        required
        placeholder="1234 5678 9012 3456"
        maxLength={19} // 16 digits + 3 spaces
      />

      {/* Name on card */}
      <FormField
        label={COPY.checkout.payment.cardName}
        id="cardName"
        name="cardName"
        type="text"
        value={values.cardName}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.cardName}
        required
      />

      {/* Expiry and CVV — side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: `${SPACE[4]}px` }}>
        <FormField
          label={COPY.checkout.payment.expiry}
          id="expiry"
          name="expiry"
          type="text"
          inputMode="numeric"
          value={values.expiry}
          onChange={handleExpiryChange}
          onBlur={handleBlur}
          error={errors.expiry}
          required
          placeholder="MM/YY"
          maxLength={5}
        />
        <FormField
          label={COPY.checkout.payment.cvv}
          id="cvv"
          name="cvv"
          type="text"
          inputMode="numeric"
          value={values.cvv}
          onChange={handleCvvChange}
          onBlur={handleBlur}
          error={errors.cvv}
          required
          placeholder="123"
          maxLength={4}
        />
      </div>

      {/* Security note */}
      <p style={{
        fontSize: `${FONT_SIZE.caption.desktop}px`,
        color: COLOR.textMuted,
        display: 'flex',
        alignItems: 'center',
        gap: `${SPACE[2]}px`,
      }}>
        <span>🔒</span>
        {COPY.checkout.payment.secureNote}
      </p>

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
        Continue to Review
      </button>
    </form>
  );
}
