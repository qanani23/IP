import { COLOR, FONT_SIZE, RADIUS, SPACE, LAYOUT } from '../../config/tokens.js';

/**
 * FormField — Reusable labeled input component
 * 
 * Provides consistent labeling, error display, and accessibility attributes
 * for all form inputs across ShippingForm and PaymentForm.
 * 
 * @param {string} label - Visible label text
 * @param {string} id - Unique identifier for input (links label via htmlFor)
 * @param {string} name - Input name attribute
 * @param {string} type - Input type (text, email, tel, etc.)
 * @param {string} inputMode - Input mode for mobile keyboards (numeric, email, tel, etc.)
 * @param {string} value - Current input value
 * @param {function} onChange - Change handler
 * @param {function} onBlur - Blur handler (optional)
 * @param {string} error - Error message (if present, shows error state)
 * @param {boolean} required - Whether field is required
 * @param {string} placeholder - Placeholder text (optional)
 * @param {object} ...rest - Additional HTML input attributes
 */
export default function FormField({
  label,
  id,
  name,
  type = 'text',
  inputMode,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder,
  ...rest
}) {
  const errorId = `${id}-error`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: `${SPACE[1]}px` }}>
      <label
        htmlFor={id}
        style={{
          fontSize: `${FONT_SIZE.caption.desktop}px`,
          color: COLOR.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {label}{required && ' *'}
      </label>
      
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={!!error}
        style={{
          width: '100%',
          minHeight: `${LAYOUT.minTouchTarget}px`,
          background: COLOR.bgSurface,
          border: `1px solid ${error ? COLOR.accentOrange : 'rgba(255,255,255,0.1)'}`,
          borderRadius: `${RADIUS.md}px`,
          color: COLOR.textPrimary,
          fontSize: `${FONT_SIZE.body.desktop}px`,
          padding: `0 ${SPACE[3]}px`,
          outline: 'none',
          transition: 'border-color 200ms ease',
        }}
        onFocus={(e) => {
          if (!error) {
            e.target.style.borderColor = 'rgba(255,255,255,0.2)';
          }
        }}
        onBlur={(e) => {
          if (!error) {
            e.target.style.borderColor = 'rgba(255,255,255,0.1)';
          }
          if (onBlur) onBlur(e);
        }}
        {...rest}
      />
      
      {error && (
        <span
          id={errorId}
          role="alert"
          style={{
            fontSize: `${FONT_SIZE.caption.desktop}px`,
            color: COLOR.accentOrange,
            marginTop: `${SPACE[1]}px`,
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
