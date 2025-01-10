import { render, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Button from './Button'

describe('Button Component', () => {
  it('renders with correct label and responds to click', () => {
    const handleClick = vi.fn()
    const { getByText } = render(<Button onClick={handleClick} label="Click Me" />)
    const buttonElement = getByText(/Click Me/i)
    fireEvent.click(buttonElement)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})