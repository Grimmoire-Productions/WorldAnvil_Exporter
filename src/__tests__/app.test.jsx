import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders article id input', () => {
    render(<App />)
    
    const articleId = screen.queryByTestId('articleId')
 
    expect(articleId).toBeInTheDocument()
  })
})