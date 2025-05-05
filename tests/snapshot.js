import { render } from '@testing-library/react'
import App from '../src/App'
 
it('renders main page unchanged', () => {
  const { container } = render(<App />)
  expect(container).toMatchSnapshot()
})