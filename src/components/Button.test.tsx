import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Button from './Button';

test('Button renders with correct label and responds to click', () => {
    const handleClick = jest.fn();
    const { getByText } = render(<Button onClick={handleClick} label="Click Me" />);
    const buttonElement = getByText(/Click Me/i);
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
});