import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../src/containers/App/App';
import React from 'react';

describe('App', () => {
  it('renders header', async () => {
    render(<App />);
    const header = screen.getByText(/World Anvil Character Sheet Export Tool/i);
    expect(header).toBeInTheDocument();
  });
});