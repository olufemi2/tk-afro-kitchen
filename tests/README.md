# E2E Testing with Playwright

This directory contains comprehensive end-to-end tests for the TK Afro Kitchen website using [Playwright](https://playwright.dev/).

## Test Structure

### Test Files

- **`homepage.spec.ts`** - Homepage functionality and navigation tests
- **`menu-and-cart.spec.ts`** - Menu browsing and cart functionality tests  
- **`checkout.spec.ts`** - Checkout flow and form validation tests
- **`safari-payment.spec.ts`** - Safari-specific payment success flow tests
- **`cross-browser.spec.ts`** - Cross-browser compatibility tests
- **`full-user-journey.spec.ts`** - Complete user journey tests

### Utilities

- **`utils/test-helpers.ts`** - Reusable test helper functions

## Setup

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Running Tests

### Local Development

```bash
# Run all tests
npm run test:e2e

# Run tests with UI mode (visual test runner)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run Safari-specific tests
npm run test:e2e:safari

# Run tests in debug mode
npm run test:e2e:debug
```

### Specific Test Files

```bash
# Run homepage tests only
npx playwright test homepage.spec.ts

# Run Safari payment tests only
npx playwright test safari-payment.spec.ts

# Run tests for specific browser
npx playwright test --project=safari
npx playwright test --project=chromium
npx playwright test --project=firefox
```

### Against Different Environments

```bash
# Test against local development server
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000 npm run test:e2e

# Test against staging
PLAYWRIGHT_TEST_BASE_URL=https://staging.tkafrokitchen.com npm run test:e2e

# Test against production
PLAYWRIGHT_TEST_BASE_URL=https://tkafrokitchen.com npm run test:e2e
```

## Test Configuration

The tests are configured in `playwright.config.ts` with:

- **Multiple browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Automatic screenshots** on failure
- **Video recording** on failure  
- **Trace collection** for debugging
- **Local dev server** startup for testing

## Browser Support

### Desktop Browsers
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari (macOS only)

### Mobile Browsers  
- ✅ Mobile Chrome (Android simulation)
- ✅ Mobile Safari (iOS simulation)

## Test Coverage

### Homepage Tests
- Page loading and content verification
- Navigation link functionality
- Menu categories display
- Popular dishes section
- Header navigation

### Menu & Cart Tests
- Menu page loading
- Adding items to cart
- Cart quantity management
- Cart total calculation
- Continue shopping functionality
- Checkout navigation

### Checkout Tests
- Checkout page loading
- Delivery details form validation
- Form field completion
- Payment method display
- Continue shopping from checkout
- Order summary display

### Safari-Specific Tests
- Safari browser detection
- Payment success redirect handling
- Safari success banner display
- URL parameter handling
- localStorage access delays
- Auto-redirect prevention

### Cross-Browser Tests
- Homepage loading across browsers
- Navigation consistency
- Cart functionality across browsers
- Responsive design verification
- Mobile-specific interactions

## Known Issues & Workarounds

### Safari Payment Testing
Safari has specific behavior around payment redirects that requires:
- Direct navigation methods (`window.location.assign`)
- Query parameter passing for order details
- Delayed localStorage access
- Success page persistence

### Mobile Testing
Mobile tests simulate device viewports and touch interactions:
- Responsive layout verification
- Mobile menu functionality
- Touch-friendly interactions

## Debugging Tests

### Visual Debugging
```bash
# Run with UI mode to see tests visually
npm run test:e2e:ui

# Run in headed mode to see browser
npm run test:e2e:headed
```

### Debug Mode
```bash
# Run in debug mode with breakpoints
npm run test:e2e:debug
```

### Screenshots & Videos
Failed tests automatically capture:
- Screenshots at point of failure
- Video recordings of test execution
- Trace files for detailed debugging

Files are saved to:
- `test-results/` - Screenshots and videos
- `playwright-report/` - HTML test reports

## CI/CD Integration

Tests run automatically on:
- **Push to main/develop** branches
- **Pull requests** to main/develop
- **Daily schedule** at 6 AM UTC
- **Manual trigger** via GitHub Actions

### GitHub Actions Workflow
- Runs tests across multiple browsers
- Tests against both local build and staging environment
- Uploads test artifacts for review
- Safari tests run on macOS runners

## Test Data & Mocking

### Payment Mocking
Tests mock payment processing to avoid real transactions:
- Stripe API responses
- PayPal integration  
- Success/failure scenarios

### Test Data
Tests use consistent test data:
- Customer details: "Test User", "test@example.com"
- Addresses: "123 Test Street, London, SW1A 1AA"
- Phone: "07123456789"

## Contributing

When adding new tests:

1. **Follow naming conventions**: `feature.spec.ts`
2. **Use test helpers** for common actions
3. **Add browser-specific tests** for Safari issues
4. **Include mobile test variants** where relevant
5. **Mock external services** (payments, APIs)
6. **Add descriptive test names** and comments

### Test Helper Usage

```typescript
import { TestHelpers } from './utils/test-helpers';

test('example test', async ({ page }) => {
  const helpers = new TestHelpers(page);
  
  await helpers.addItemToCart();
  await helpers.fillDeliveryDetails();
  await helpers.simulatePaymentSuccess();
});
```

## Reports

Test reports are generated in HTML format and include:
- Test results summary
- Failed test details
- Screenshots and videos
- Performance metrics
- Browser compatibility matrix

Access reports at: `playwright-report/index.html`