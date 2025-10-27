import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

test('renders Navbar with Cart link', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/Cart/i)).toBeInTheDocument();
});

test('renders Home page by default', () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );
  // Home page renders search/filter/sort controls
  expect(screen.getByPlaceholderText(/Search products/i)).toBeInTheDocument();
});
