
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ProductShareButton } from './ProductShareButton';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { db } from '@/lib/supabase';
import { Toaster } from '@/components/ui/toaster';

// Mock the dependencies
vi.mock('@/lib/supabase', () => ({
  db: {
    getShareUrl: vi.fn().mockResolvedValue('/shopapp/123/product/456')
  }
}));

// Mock the clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined)
  }
});

// Mock the toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
    dismiss: vi.fn(),
    toasts: []
  })
}));

describe('ProductShareButton', () => {
  const mockProduct = {
    id: 456,
    name: 'Test Product',
    description: 'Test Description',
    cost_price: 10,
    selling_price: 20,
    stock: 100,
    business_id: '123'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <>
        <ProductShareButton product={mockProduct} />
        <Toaster />
      </>
    );
    
    expect(screen.getByRole('button')).toBeDefined();
  });

  it('opens popover when clicked', async () => {
    render(
      <>
        <ProductShareButton product={mockProduct} />
        <Toaster />
      </>
    );
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    
    expect(screen.getByText('Share Product')).toBeDefined();
    expect(screen.getByText('Copy the link to share this product directly')).toBeDefined();
    expect(screen.getByText('Copy Link')).toBeDefined();
  });

  it('copies link to clipboard when button is clicked', async () => {
    render(
      <>
        <ProductShareButton product={mockProduct} />
        <Toaster />
      </>
    );
    
    // Open the popover
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    
    // Click the copy button
    await act(async () => {
      fireEvent.click(screen.getByText('Copy Link'));
    });
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('/shopapp/123/product/456');
    expect(db.getShareUrl).toHaveBeenCalledWith('123', '456');
  });
});
