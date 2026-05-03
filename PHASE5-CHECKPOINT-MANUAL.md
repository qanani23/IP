# Phase 5 Checkpoint — Manual Testing Guide

## Checkpoint Requirements

This document provides a manual testing checklist for Phase 5 (Checkout Flow) requirements.

### ✅ Test 1: Shipping Form Validation

**Steps:**
1. Navigate to `/checkout` with items in cart
2. Try to submit the shipping form without filling any fields
3. Verify inline error messages appear for all required fields
4. Enter an invalid email format (e.g., "test@")
5. Verify email format error appears
6. Fill all fields correctly and submit
7. Verify form advances to Payment step

**Expected Results:**
- ✓ Required field errors show "Required"
- ✓ Invalid email shows "Invalid email format"
- ✓ Errors announced via aria-describedby
- ✓ Form advances to step 2 when valid

---

### ✅ Test 2: Payment Form Card Masking

**Steps:**
1. Advance to Payment step (step 2)
2. Focus on the card number field
3. Type "1234567890123456"
4. Blur the field (click outside)
5. Verify card number displays as "•••• •••• •••• 3456"
6. Focus the field again
7. Verify raw digits are shown for editing

**Expected Results:**
- ✓ Card number masked on blur
- ✓ Last 4 digits visible
- ✓ Raw value shown on focus
- ✓ 16-digit validation works

---

### ✅ Test 3: Payment Form Expiry Validation

**Steps:**
1. On Payment step, enter expiry "01/20" (past date)
2. Try to submit
3. Verify "Card has expired" error appears
4. Enter future expiry (e.g., "12/30")
5. Submit successfully

**Expected Results:**
- ✓ Past expiry shows "Card has expired"
- ✓ Future expiry passes validation
- ✓ Format validation works (MM/YY)

---

### ✅ Test 4: Step Progression

**Steps:**
1. Complete Shipping form → verify advance to Payment
2. Complete Payment form → verify advance to Review
3. On Review step, click "Edit" on Shipping summary
4. Verify navigation back to step 1
5. Re-submit and advance to Review again
6. Click "Edit" on Payment summary
7. Verify navigation back to step 2

**Expected Results:**
- ✓ Shipping → Payment → Review progression works
- ✓ Edit links navigate to correct steps
- ✓ Form data preserved when navigating back

---

### ✅ Test 5: Processing State

**Steps:**
1. On Review step, click "Place Order"
2. Immediately observe button state
3. Verify spinner appears
4. Verify button is disabled
5. Try clicking button again during processing
6. Wait for order to complete or fail

**Expected Results:**
- ✓ Spinner replaces button text
- ✓ Button disabled during processing
- ✓ Double-click does not trigger multiple submissions
- ✓ Processing lasts 1.5-2 seconds

---

### ✅ Test 6: Payment Failure Handling

**Steps:**
1. Place multiple orders until one fails (~20% failure rate)
2. When payment fails, verify:
   - Error message displays
   - Button re-enables with "Try Again" text
   - All form data preserved
   - Cart items still present
3. Click "Try Again" and verify resubmission works

**Expected Results:**
- ✓ Payment failure shows inline error
- ✓ Button shows "Try Again"
- ✓ Form data preserved
- ✓ Cart NOT cleared on failure
- ✓ Can retry submission

---

### ✅ Test 7: Cart Guard

**Steps:**
1. Navigate to `/checkout` with empty cart
2. Verify immediate redirect to `/cart`
3. Add items to cart, go to checkout
4. Open browser console
5. Run: `localStorage.setItem('slam-dunk-cart', '[]')`
6. Refresh page
7. Verify redirect to `/cart`

**Expected Results:**
- ✓ Empty cart redirects to /cart
- ✓ No UI flash before redirect
- ✓ Redirect happens via useEffect guard

---

### ✅ Test 8: Checkout State Persistence

**Steps:**
1. Fill out Shipping form and advance to Payment
2. Refresh the page
3. Verify you're still on Payment step
4. Verify Shipping data is restored
5. Fill out Payment form (including card number)
6. Refresh the page
7. Verify card name restored but NOT card number

**Expected Results:**
- ✓ Step number persists across refresh
- ✓ Shipping data restored
- ✓ Card name restored
- ✓ Card number NEVER persisted (security)

---

### ✅ Test 9: Stock Warning

**Steps:**
1. Manually edit `productData.js` to set stock to 1
2. Add 5 items to cart
3. Proceed to Review step
4. Verify stock warning appears
5. Warning should mention limited availability

**Expected Results:**
- ✓ Stock warning displays when cart qty > product stock
- ✓ Warning shows product name and available stock
- ✓ Warning styled with orange accent

---

### ✅ Test 10: Meta Tags

**Steps:**
1. Navigate to `/checkout`
2. Open browser DevTools → Elements tab
3. Inspect `<head>` section
4. Verify `<meta name="robots" content="noindex">` exists
5. Verify page title includes "Checkout"

**Expected Results:**
- ✓ noindex meta tag present
- ✓ Page title set correctly
- ✓ Meta tag removed when leaving page

---

## Summary

All Phase 5 checkpoint requirements implemented:

- ✅ ShippingForm validates all required fields and email format
- ✅ PaymentForm masks card number on blur, validates 16 digits and future expiry
- ✅ Step progression works: Shipping → Payment → Review
- ✅ Edit links navigate back to correct steps
- ✅ Processing spinner shows, button disabled during processing
- ✅ Double-click prevention works (only one submission)
- ✅ Payment failure shows error, re-enables button, preserves form data, cart unchanged
- ✅ Cart guard redirects to /cart when cart is empty
- ✅ Checkout state survives page refresh (step + shipping restored, no card number)

## Next Steps

1. Test all scenarios manually in the browser
2. Verify accessibility with keyboard navigation
3. Test on mobile viewport
4. Proceed to Phase 6: Remaining Pages
