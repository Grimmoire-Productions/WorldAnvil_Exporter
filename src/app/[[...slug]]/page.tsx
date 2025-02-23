import { ClientOnly } from './client'
import './page.css';

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return <ClientOnly />
}