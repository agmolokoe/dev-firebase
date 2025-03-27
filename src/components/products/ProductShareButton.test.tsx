
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProductShareButton } from './ProductShareButton'
import { db } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

// Mock dependencies
vi.mock('@/lib/supabase', () => ({
  db: {
    getShareUrl: vi.fn()
  }
}))

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn()
}))

// Mock product data
const mockProduct = {
  id: 123,
  name: 'Test Product',
  description: 'Test description',
  cost_price: 10,
  selling_price: 20,
  stock: 50,
  business_id: 'business-123',
  image_url: 'https://example.com/image.jpg'
}

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn()
  }
})

describe('ProductShareButton Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock toast
    vi.mocked(useToast).mockReturnValue({
      toast: vi.fn()
    })
    
    // Mock getShareUrl
    vi.mocked(db.getShareUrl).mockResolvedValue('https://example.com/share/123')
  })

  it('renders the share button correctly', () => {
    render(<ProductShareButton product={mockProduct} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('opens popover when clicked', async () => {
    render(<ProductShareButton product={mockProduct} />)
    fireEvent.click(screen.getByRole('button'))
    
    await waitFor(() => {
      expect(screen.getByText('Share Product')).toBeInTheDocument()
      expect(screen.getByText('Copy Link')).toBeInTheDocument()
    })
  })

  it('copies link to clipboard when Copy Link button is clicked', async () => {
    render(<ProductShareButton product={mockProduct} />)
    
    // Open popover
    fireEvent.click(screen.getByRole('button'))
    
    // Click copy link button
    const copyButton = await screen.findByText('Copy Link')
    fireEvent.click(copyButton)
    
    await waitFor(() => {
      expect(db.getShareUrl).toHaveBeenCalledWith('business-123', 123)
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com/share/123')
      expect(useToast().toast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Link copied'
      }))
    })
  })

  it('shows error toast when copying fails', async () => {
    // Mock clipboard failure
    vi.mocked(navigator.clipboard.writeText).mockRejectedValue(new Error('Clipboard error'))
    
    render(<ProductShareButton product={mockProduct} />)
    
    // Open popover
    fireEvent.click(screen.getByRole('button'))
    
    // Click copy link button
    const copyButton = await screen.findByText('Copy Link')
    fireEvent.click(copyButton)
    
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Error',
        variant: 'destructive'
      }))
    })
  })

  it('shows error toast when URL generation fails', async () => {
    // Mock getShareUrl failure
    vi.mocked(db.getShareUrl).mockRejectedValue(new Error('URL generation error'))
    
    render(<ProductShareButton product={mockProduct} />)
    
    // Open popover
    fireEvent.click(screen.getByRole('button'))
    
    // Click copy link button
    const copyButton = await screen.findByText('Copy Link')
    fireEvent.click(copyButton)
    
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Error',
        variant: 'destructive'
      }))
    })
  })
})
