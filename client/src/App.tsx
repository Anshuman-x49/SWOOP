import { RouterProvider } from 'react-router'
import { router } from './app/routes/AppRoutes'

export function App() {
  return <RouterProvider router={router} />
}

export default App
