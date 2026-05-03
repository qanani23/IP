// ─── Phase 6 Checkpoint Test ──────────────────────────────────────────────────
// Verifies:
// - Confirmation page shows order snapshot when lastOrder exists
// - Confirmation page shows fallback when no order data
// - 404 page renders for unknown routes
// - Account page saves/loads name and email from localStorage
// - Account page shows last order history

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Routes, Route, MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ConfirmationPage from './ConfirmationPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import AccountPage from './AccountPage.jsx';
import { CartProvider } from '../context/CartContext.jsx';
import { ToastProvider } from '../context/ToastContext.jsx';

// Mock components to avoid 3D dependencies
vi.mock('../components/Navigation.jsx', () => ({
  default: () => <nav data-testid="navigation">Navigation</nav>,
}));

vi.mock('../components/Footer.jsx', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock('../components/PageContainer.jsx', () => ({
  default: ({ children }) => <div data-testid="page-container">{children}</div>,
}));

vi.mock('../components/OrderSummary.jsx', () => ({
  default: ({ subtotal, total }) => (
    <div data-testid="order-summary">
      <div>Subtotal: ${subtotal?.toFixed(2)}</div>
      <div>Total: ${total?.toFixed(2)}</div>
    </div>
  ),
}));

function TestWrapper({ children, initialRoute = '/' }) {
  return (
    <HelmetProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <CartProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </CartProvider>
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe('Phase 6 Checkpoint — Remaining Pages', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('ConfirmationPage', () => {
    it('shows order snapshot when lastOrder exists', async () => {
      const mockOrder = {
        orderId: 'SD-1234567890',
        items: [
          { id: 'sd-ce-001', name: 'SLAM DUNK — Champion Edition', price: 34.99, quantity: 2 },
        ],
        subtotal: 69.98,
        total: 69.98,
        placedAt: '2026-05-02T12:00:00.000Z',
      };
      localStorage.setItem('slam-dunk-last-order', JSON.stringify(mockOrder));

      render(
        <TestWrapper initialRoute="/confirmation/SD-1234567890">
          <Routes>
            <Route path="/confirmation/:orderId" element={<ConfirmationPage />} />
          </Routes>
        </TestWrapper>
      );

      // Check for confirmation title
      await waitFor(() => {
        expect(screen.getByText(/Order Confirmed!/i)).toBeInTheDocument();
      });

      // Check for order number
      expect(screen.getByText(/SD-1234567890/)).toBeInTheDocument();

      // Check for order items
      expect(screen.getByText(/SLAM DUNK — Champion Edition/)).toBeInTheDocument();
      expect(screen.getByText(/Qty: 2/)).toBeInTheDocument();

      // Check for order summary
      expect(screen.getByTestId('order-summary')).toBeInTheDocument();

      // Check for delivery info
      expect(screen.getByText(/3–5 business days/i)).toBeInTheDocument();

      // Check for timeline steps
      expect(screen.getByText(/Order Received/i)).toBeInTheDocument();
      expect(screen.getByText(/Quality Check/i)).toBeInTheDocument();
      expect(screen.getByText(/Shipped/i)).toBeInTheDocument();
      expect(screen.getByText(/Delivered/i)).toBeInTheDocument();
    });

    it('shows fallback when no order data', async () => {
      render(
        <TestWrapper initialRoute="/confirmation/unknown">
          <Routes>
            <Route path="/confirmation/:orderId" element={<ConfirmationPage />} />
          </Routes>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/We couldn't find your order/i)).toBeInTheDocument();
      });

      // Check for continue shopping link
      expect(screen.getByText(/Continue Shopping/i)).toBeInTheDocument();
    });
  });

  describe('NotFoundPage', () => {
    it('renders for unknown routes', async () => {
      render(
        <TestWrapper initialRoute="/unknown-route">
          <Routes>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </TestWrapper>
      );

      // Check for 404 heading
      await waitFor(() => {
        expect(screen.getByText('404')).toBeInTheDocument();
      });

      // Check for error message
      expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
      expect(screen.getByText(/doesn't exist/i)).toBeInTheDocument();

      // Check for back home link
      expect(screen.getByText(/Back to Home/i)).toBeInTheDocument();

      // Check that Navigation and Footer are rendered
      expect(screen.getByTestId('navigation')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  describe('AccountPage', () => {
    it('saves and loads name and email from localStorage', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper initialRoute="/account">
          <Routes>
            <Route path="/account" element={<AccountPage />} />
          </Routes>
        </TestWrapper>
      );

      // Check for account page heading
      await waitFor(() => {
        expect(screen.getByText(/My Account/i)).toBeInTheDocument();
      });

      // Check for guest prompt initially
      expect(screen.getByText(/shopping as a guest/i)).toBeInTheDocument();

      // Fill in name and email
      const nameInput = screen.getByLabelText(/Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);

      await user.clear(nameInput);
      await user.type(nameInput, 'John Doe');
      await user.clear(emailInput);
      await user.type(emailInput, 'john@example.com');

      // Click save button
      const saveButton = screen.getByText(/Save Details/i);
      await user.click(saveButton);

      // Verify data was saved to localStorage
      await waitFor(() => {
        const saved = JSON.parse(localStorage.getItem('slam-dunk-account'));
        expect(saved.name).toBe('John Doe');
        expect(saved.email).toBe('john@example.com');
      });
    });

    it('loads existing account data on mount', async () => {
      localStorage.setItem(
        'slam-dunk-account',
        JSON.stringify({ name: 'Jane Smith', email: 'jane@example.com' })
      );

      render(
        <TestWrapper initialRoute="/account">
          <Routes>
            <Route path="/account" element={<AccountPage />} />
          </Routes>
        </TestWrapper>
      );

      // Check that inputs are pre-filled
      await waitFor(() => {
        const nameInput = screen.getByLabelText(/Name/i);
        const emailInput = screen.getByLabelText(/Email Address/i);
        expect(nameInput).toHaveValue('Jane Smith');
        expect(emailInput).toHaveValue('jane@example.com');
      });
    });

    it('shows last order history when available', async () => {
      const mockOrder = {
        orderId: 'SD-9876543210',
        items: [{ id: 'sd-ce-001', name: 'SLAM DUNK', price: 34.99, quantity: 1 }],
        total: 34.99,
        placedAt: '2026-05-02T12:00:00.000Z',
      };
      localStorage.setItem('slam-dunk-last-order', JSON.stringify(mockOrder));

      render(
        <TestWrapper initialRoute="/account">
          <Routes>
            <Route path="/account" element={<AccountPage />} />
          </Routes>
        </TestWrapper>
      );

      // Check for order history section
      await waitFor(() => {
        expect(screen.getByText(/Order History/i)).toBeInTheDocument();
      });

      // Check for order details
      expect(screen.getByText(/SD-9876543210/)).toBeInTheDocument();
      expect(screen.getByText(/\$34\.99/)).toBeInTheDocument();
      expect(screen.getByText(/1 item/)).toBeInTheDocument();
    });

    it('shows "No orders yet" when no order history', async () => {
      render(
        <TestWrapper initialRoute="/account">
          <Routes>
            <Route path="/account" element={<AccountPage />} />
          </Routes>
        </TestWrapper>
      );

      // Check for empty state
      await waitFor(() => {
        expect(screen.getByText(/No orders yet/i)).toBeInTheDocument();
      });
    });
  });
});
