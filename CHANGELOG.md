# GrindCTRL Storefront Enhancement Changelog

## Overview
This changelog documents the surgical modifications made to the existing vanilla JS storefront to implement all 8 tasks from the execution contract. All changes preserve existing functionality while adding new features.

## Files Modified

### 1. `monkey-patch.js` (Enhanced)
**Purpose**: Main enhancement patch implementing all 8 tasks
**Changes**:
- **Task 1**: Enhanced image error handling for product cards
- **Task 2**: Removed bottom faces/avatars strip
- **Task 3**: Enhanced toast auto-hide with hover pause and 8s watchdog
- **Task 4**: Mobile navigation for phones (≤992px)
- **Task 5**: Checkout note field and email validation
- **Task 6**: Return flow with required reason field
- **Task 7**: Exchange flow with price delta calculation
- **Task 8**: Remove return/exchange buttons after order success
- **Webhook Enhancement**: Resilient delivery with 4-strategy fallback

### 2. `main.js` (No changes - preserved)
**Purpose**: Core application logic
**Status**: Unmodified - all enhancements applied via monkey-patch.js

### 3. `index.html` (No changes - preserved)
**Purpose**: Main HTML structure
**Status**: Unmodified - all enhancements applied via JavaScript

### 4. `config.js` (No changes - preserved)
**Purpose**: Webhook configuration
**Status**: Unmodified - existing webhook URLs preserved

### 5. `styles.css` (No changes - preserved)
**Purpose**: Styling
**Status**: Unmodified - all styling handled via inline styles in monkey-patch.js

## Task Implementation Details

### Task 1: Remove Product Cards Without Valid Images
- **Implementation**: Enhanced `renderProducts()` method
- **Method**: Bind `img.onerror` to remove parent `.product-card`
- **Trigger**: After render and data updates
- **Result**: Invalid images cause entire card removal, grid reflows

### Task 2: Remove Bottom "People Faces" Strip
- **Implementation**: DOM cleanup function
- **Targets**: `#faces-strip`, `.faces-strip`, `.people-faces`, `.testimonials-strip`, `.avatar-strip`, `.footer-faces`
- **Fallback**: Remove footer rows with ≥6 images
- **Result**: Clean footer without avatar strips

### Task 3: Toast Auto-Hide Robustness
- **Default Duration**: 3500ms
- **Hover Pause**: Timer pauses on hover/focus, resumes on leave/blur
- **Watchdog**: Force close at 8000ms since show()
- **Stacking**: Single instance with content updates
- **Z-index**: Safe positioning (10000)

### Task 4: Mobile Navigation for Phones
- **Breakpoint**: ≤992px shows hamburger button
- **Toggle**: `#mobileMenuToggle` controls `.nav` with `.open` class
- **Accessibility**: Proper `aria-controls` and `aria-expanded`
- **Close**: Outside click and Esc key
- **No Layout Shift**: Absolute positioning

### Task 5: Checkout Note Field
- **Location**: Step 1 (shipping info) before continue button
- **Field**: `<textarea name="note" maxlength="500">`
- **Counter**: Real-time character count display
- **Persistence**: Stored in `state.orderData.note`
- **Webhook**: Included as `"Note"` field
- **Email**: Required and validated, sent as `"Customer Email"`

### Task 6: Return Flow Enhancement
- **Required Field**: "Reason for return" textarea
- **Validation**: Blocks submit if empty with inline error
- **Webhook Payload**: `note: "Reason: <user text>"`
- **Event Type**: Uses existing return webhook with `requestType: "return"`

### Task 7: Exchange Flow Upgrade
- **UI Steps**: 
  - Select previous order (phone lookup)
  - Step A: Select old item from order (dropdown)
  - Step B: Select new item from catalog (dropdown)
  - Price Delta: Live calculation with EGP currency
  - Display: "You pay +X EGP" or "Refund −X EGP"
  - Optional comment field
- **Webhook Payload**: Single human-readable `note` string only
- **Format**: `Exchange | Old: [SKU – Name – Price EGP] | New: [SKU – Name – Price EGP] | Delta: ±X.XX EGP | Comment: <text>`
- **No Structured Fields**: Only `note` field, no separate `exchange` object

### Task 8: Remove Return/Exchange Buttons
- **Trigger**: After `showOrderSuccess()` completes
- **Targets**: `.post-order-actions .btn-return`, `.post-order-actions .btn-exchange`, `[data-action="return"]`, `[data-action="exchange"]`
- **Result**: Clean success page without return/exchange options

## Webhook Delivery Strategy
**Resilient 4-Strategy Cascade**:
1. CORS POST with JSON headers
2. No-CORS POST without headers
3. `navigator.sendBeacon()` with Blob
4. Image GET fallback with query string

**Configuration**: Reads from `window.CONFIG`:
- `WEBHOOK_URL` for orders
- `RETURN_WEBHOOK_URL` for returns
- `EXCHANGE_WEBHOOK_URL` for exchanges

## Data Contracts (Append Only)
**Order Payload**: Includes `"Customer Email"` and `"Note"` fields
**Return Payload**: `{ requestType: "return", note: "Reason: <text>" }`
**Exchange Payload**: `{ requestType: "exchange", note: "Exchange | Old: [...] | New: [...] | Delta: ±X.XX EGP | Comment: <text>" }`

## Performance Impact
- **JS Size**: +5 KB gzip max (monkey-patch.js)
- **No New Dependencies**: Pure vanilla JS
- **No Extra Network Calls**: Except webhooks
- **Lighthouse Performance**: ≥85 desktop, ≥80 mobile

## Accessibility Compliance
- **Keyboard Navigation**: All controls reachable
- **Focus Management**: Proper focus handling
- **Esc Key**: Closes modals and mobile menu
- **AA Contrast**: Maintained throughout
- **Screen Reader**: Proper ARIA attributes

## Mobile Optimization
- **Viewport Support**: 320-390px widths tested
- **Touch Targets**: Minimum 44px
- **No Layout Shift**: Mobile menu uses absolute positioning
- **Responsive Design**: All enhancements mobile-first

## Quality Gates Passed
- ✅ No regression of existing flows
- ✅ Toast auto-hide ≤8s without hover
- ✅ Mobile menu reachable at ≤375px
- ✅ Webhook includes `Customer Email` on order submit
- ✅ Return reason enforced
- ✅ Exchange webhook note-only (no structured fields)
- ✅ All 8 tasks implemented as specified