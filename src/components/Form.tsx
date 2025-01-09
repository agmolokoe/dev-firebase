import React, { useState } from 'react';

const Form = () => {
    const [input, setInput] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() === '') {
            alert('Input cannot be empty');
            return;
        }
        // Submit the form
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="inputField">Input</label>
            <input
                id="inputField"
                type="text"
                value={input}
                onChange={handleChange}
                aria-required="true"
            />
            <button type="submit">Submit</button>
        </form>
    );
};

export default Form;