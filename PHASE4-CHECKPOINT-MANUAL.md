# Phase 4 Checkpoint — Manual Verification

## Task 4.4 Verification Checklist

### 4.4.1 — Empty Cart State
- [ ] Navigate to `/cart` with empty cart
- [ ] Verify "Your cart is empty." message displays
- [ ] Verify "Looks like you haven't added anything yet." subtitle displays
- [ ] Verify "Continue Shopping" link navigates to `/shop`

### 4.4.2 — Cart Operations and localStorage Persistence
- [ ] Add a product to cart from product page
- [ ] Navigate to `/cart`
- [ ] Verify product displays with correct name, SKU, price, and quantity
- [ ] Click `+` button to increase quantity
- [ ] Verify quantity updates in UI
- [ ] Refresh page and verify quantity persists
- [ ] Click `−` button to decrease quantity
- [ ] Verify quantity updates in UI
- [ ] Click "Remove" button
- [ ] Verify item is removed and empty state shows
- [ ] Check browser DevTools → Application → Local Storage → `slam-dunk-cart`
- [ ] Verify localStorage updates after each operation

### 4.4.3 — Stock Limit Enforcement
- [ ] Add product to cart with quantity at stock limit (12 for Champion Edition)
- [ ] Navigate to `/cart`
- [ ] Verify `+` button is disabled (grayed out, cursor: not-allowed)
- [ ] Set quantity to 1
- [ ] Verify `−` button is disabled

### 4.4.4 — Promo Code Validation
- [ ] Add product to cart and navigate to `/cart`
- [ ] Locate promo code input field
- [ ] Type "SLAM10" (case insensitive)
- [ ] Wait 300ms (debounce delay)
- [ ] Verify "Promo code applied!" success message displays
- [ ] Verify "Promo (SLAM10)" line appears in order summary
- [ ] Verify "−$3.50" discount displays
- [ ] Verify total is reduced by $3.50
- [ ] Clear input and type "INVALID"
- [ ] Wait 300ms
- [ ] Verify "Invalid promo code." error message displays
- [ ] Test debounce: Type "SL" quickly, verify no message appears immediately
- [ ] Continue typing "AM10", verify message appears after 300ms delay

### 4.4.5 — Unavailable Item Notice
- [ ] Open browser DevTools → Console
- [ ] Run: `localStorage.setItem('slam-dunk-cart', JSON.stringify([{id:'fake-id',name:'Fake Product',price:99,quantity:1,image:'/fallback.jpg',stock:10,sku:'FAKE'}]))`
- [ ] Refresh `/cart` page
- [ ] Verify orange warning box displays at top
- [ ] Verify "This product is currently unavailable." message shows
- [ ] Verify "Fake Product" is listed in warning
- [ ] Verify "Remove" button is present in warning
- [ ] Click "Remove" button
- [ ] Verify item is removed and warning disappears

## Additional Checks

### Component Implementation
- [x] CartItem.jsx exists and uses React.memo
- [x] OrderSummary.jsx exists with promo input support
- [x] CartPage.jsx exists with all required features
- [x] Promo code validation: SLAM10 = $3.50 discount (fixed)

### Accessibility
- [ ] All buttons meet 48×48px minimum touch target
- [ ] `−` button has aria-label "Decrease quantity"
- [ ] `+` button has aria-label "Increase quantity"
- [ ] Remove button has aria-label "Remove [Product Name] from cart"
- [ ] Cart page has `<meta name="robots" content="noindex">`

### Analytics
- [ ] Open DevTools Console
- [ ] Navigate to `/cart` with items
- [ ] Verify `[analytics] view_cart { cartTotal: X, itemCount: Y }` logs

## Test Results

**Date:** _____________
**Tester:** _____________

**Overall Status:** ⬜ PASS ⬜ FAIL

**Notes:**
