import {createLazyFileRoute} from '@tanstack/react-router'
import App from '@/App.tsx'

export const Route = createLazyFileRoute('/')({
  component: App,
})
